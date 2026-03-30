import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/BarcodeScanner.scss';
import Loader from './Loader';

const BarcodeScanner = ({ onScan, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [error, setError] = useState('');
  const [productInfo, setProductInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setHasPermission(true);
      streamRef.current = stream;
      return stream;
    } catch (err) {
      console.error('Camera permission denied:', err);
      setError(t('camera_permission_required'));
      return null;
    }
  };

  const startScanning = async () => {
    setError('');
    setScannedCode('');
    setProductInfo(null);

    const stream = await requestCameraPermission();
    if (!stream) return;

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsScanning(true);

      // Start barcode detection
      startBarcodeDetection();
    }
  };

  const stopScanning = () => {
    setIsScanning(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startBarcodeDetection = () => {
    // For demo purposes, we'll simulate barcode detection
    // In a real implementation, you'd use a library like QuaggaJS or ZXing
    const mockBarcodes = [
      '123456789012', // Example UPC
      '4006381333931', // Example EAN
      '8901234567890'  // Example Indian barcode
    ];

    // Simulate random barcode detection after 2-5 seconds
    const detectionTimer = setTimeout(() => {
      if (isScanning) {
        const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
        handleBarcodeDetected(randomBarcode);
      }
    }, 2000 + Math.random() * 3000);

    return () => clearTimeout(detectionTimer);
  };

  const handleBarcodeDetected = async (barcode) => {
    setScannedCode(barcode);
    setIsScanning(false);
    setIsLoading(true);

    try {
      // In a real app, you'd call an API to get product info
      // For demo, we'll simulate API call
      const productData = await fetchProductInfo(barcode);
      setProductInfo(productData);

    } catch (err) {
      console.error('Error fetching product info:', err);
      setError(t('failed_fetch_product_info'));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductInfo = async (barcode) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock product data based on barcode
    const mockProducts = {
      '123456789012': {
        name: 'Organic Tomatoes',
        brand: 'Fresh Farms',
        category: 'Vegetables',
        nutrition: {
          calories: 18,
          protein: 0.9,
          carbs: 3.9,
          fat: 0.2
        }
      },
      '4006381333931': {
        name: 'Whole Wheat Pasta',
        brand: 'Italian Kitchen',
        category: 'Pasta',
        nutrition: {
          calories: 371,
          protein: 12.5,
          carbs: 75.0,
          fat: 1.5
        }
      },
      '8901234567890': {
        name: 'Basmati Rice',
        brand: 'Golden Grain',
        category: 'Rice',
        nutrition: {
          calories: 130,
          protein: 2.7,
          carbs: 28.0,
          fat: 0.3
        }
      }
    };

    return mockProducts[barcode] || {
      name: 'Unknown Product',
      brand: 'Unknown',
      category: 'Unknown',
      nutrition: null
    };
  };

  const handleManualEntry = () => {
    const barcode = prompt(t('enter_barcode_manually'));
    if (barcode && barcode.trim()) {
      handleBarcodeDetected(barcode.trim());
    }
  };

  const addToPantry = () => {
    if (productInfo && onScan) {
      onScan({ barcode: scannedCode, product: productInfo, destination: 'pantry' });
    }
  };

  const addToShoppingList = () => {
    if (productInfo) {
      alert(t('shopping_list_not_ready', { defaultValue: `${productInfo.name} scanned. Shopping list sync is not available yet.` }));
      onClose && onClose();
    }
  };

  return (
    <div className="barcode-scanner-overlay">
      <div className="barcode-scanner-modal">
        <div className="scanner-header">
          <h2>{t('barcode_scanner_title')}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="scanner-content">
          {!hasPermission && !isScanning && (
            <div className="permission-prompt">
              <p>{t('camera_access_required')}</p>
              <button onClick={startScanning} className="primary-btn">
                {t('allow_camera_access')}
              </button>
            </div>
          )}

          {hasPermission && !scannedCode && (
            <div className="scanner-view">
              <div className="video-container">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="scanner-video"
                />
                {isScanning && (
                  <div className="scan-overlay">
                    <div className="scan-line"></div>
                    <div className="scan-frame"></div>
                  </div>
                )}
              </div>

              <div className="scanner-controls">
                {!isScanning ? (
                  <button onClick={startScanning} className="primary-btn">
                    Start Scanning
                  </button>
                ) : (
                  <button onClick={stopScanning} className="secondary-btn">
                    Stop Scanning
                  </button>
                )}

                <button onClick={handleManualEntry} className="secondary-btn">
                  Enter Manually
                </button>
              </div>

              {isScanning && (
                <p className="scanning-text">Position barcode within the frame...</p>
              )}
            </div>
          )}

          {isLoading && (
            <div className="loading-state">
              <Loader label="Fetching product information..." variant="card" size="sm" />
            </div>
          )}

          {scannedCode && productInfo && !isLoading && (
            <div className="product-result">
              <div className="product-info">
                <h3>{productInfo.name}</h3>
                <p className="brand">by {productInfo.brand}</p>
                <p className="category">Category: {productInfo.category}</p>

                {productInfo.nutrition && (
                  <div className="nutrition-info">
                    <h4>Nutrition (per 100g)</h4>
                    <div className="nutrition-grid">
                      <div>Calories: {productInfo.nutrition.calories}</div>
                      <div>Protein: {productInfo.nutrition.protein}g</div>
                      <div>Carbs: {productInfo.nutrition.carbs}g</div>
                      <div>Fat: {productInfo.nutrition.fat}g</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="product-actions">
                <button onClick={addToPantry} className="primary-btn">
                  Add to Pantry
                </button>
                <button onClick={addToShoppingList} className="secondary-btn">
                  Add to Shopping List
                </button>
                <button onClick={() => setScannedCode('')} className="secondary-btn">
                  Scan Another
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => setError('')} className="secondary-btn">
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
