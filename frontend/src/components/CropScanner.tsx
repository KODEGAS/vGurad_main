import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera, Upload, Scan, ArrowLeft, Loader2, X, Package, DollarSign, Clock, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/TranslationContext';
import { auth } from '../firebase';

const DEMO_IMAGE_URL = 'https://placehold.co/600x400/8B4513/FFFFFF?text=Infected+Crop';

interface CropScannerProps {
  onBack: () => void;
}

interface Medicine {
  name: string;
  brand?: string;
  type?: string;
  active_ingredient?: string;
  pack_size?: string;
  price?: string;
  image_url?: string;
  application_rate?: string;
  method?: string;
  frequency?: string;
  availability?: string;
  priority?: number;
  note?: string;
}

interface AnalysisResult {
  disease: string;
  confidence: number;
  description: string;
  symptoms: string[];
  causes: string[];
  prevention: string[];
  medicines: Medicine[];
}

export const CropScanner: React.FC<CropScannerProps> = ({ onBack }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use proxy through your backend instead of direct HTTP calls
  const API_BASE_URL = 'https://vgurad-backend.onrender.com/api/crop-analysis';

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const analyzeCrop = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select an image to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Step 1: Send image to prediction API via proxy
      const predictionResponse = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!predictionResponse.ok) {
        throw new Error(`Prediction API error: ${predictionResponse.statusText}`);
      }

      const predictionResult = await predictionResponse.json();
      const diseaseName = predictionResult.predicted_class;

      if (!diseaseName) {
        throw new Error('Could not get a disease name from the prediction.');
      }

      // Step 2: Fetch detailed disease info and medicines in parallel via proxy
      const diseaseInfoUrl = `${API_BASE_URL}/disease-info/${encodeURIComponent(diseaseName)}`;
      const medicinesUrl = `${API_BASE_URL}/disease-medicines?name=${encodeURIComponent(diseaseName)}`;

      const [diseaseInfoResponse, medicinesResponse] = await Promise.all([
        fetch(diseaseInfoUrl),
        fetch(medicinesUrl),
      ]);

      if (!diseaseInfoResponse.ok || !medicinesResponse.ok) {
        throw new Error('Failed to fetch detailed disease information.');
      }

      const diseaseInfoResult = await diseaseInfoResponse.json();
      const medicinesResult = await medicinesResponse.json();

      // Step 3: Consolidate all the data with the correct key mapping
      const combinedResult: AnalysisResult = {
        disease: diseaseName.toUpperCase(),
        confidence: Number((predictionResult.confidence * 100).toFixed(2)),
        description: diseaseInfoResult?.info?.description || '',
        symptoms: diseaseInfoResult?.info?.symptoms || [],
        causes: (diseaseInfoResult?.info?.caused_by) ? [diseaseInfoResult.info.caused_by] : [],
        prevention: diseaseInfoResult?.info?.prevention || [],
        medicines: medicinesResult?.recommended_medicines || [],
      };

      setAnalysisResult(combinedResult);
      toast({
        title: "Success",
        description: "Crop analysis completed!",
      });

    } catch (error) {
      console.error('Error during analysis:', error);
      toast({
        title: "Error",
        description: "Failed to analyze crop. Please try again.",
        variant: "destructive",
      });
      setAnalysisResult({
        disease: 'Analysis Failed',
        confidence: 0,
        description: 'An error occurred while fetching data.',
        symptoms: [],
        causes: [],
        prevention: [],
        medicines: [],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Capture photo from device camera
  const captureFromCamera = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (event: any) => {
        const file = event.target.files?.[0];
        if (file) {
          setSelectedFile(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            setSelectedImage(e.target?.result as string);
            setAnalysisResult(null);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to capture photo from camera.",
        variant: "destructive",
      });
    }
  };

  const handleMedicineClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsMedicineModalOpen(true);
  };

  const closeMedicineModal = () => {
    setIsMedicineModalOpen(false);
    setSelectedMedicine(null);
  };

  const saveResults = () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save results",
          variant: "destructive",
        });
        return;
      }

      if (!analysisResult) {
        toast({
          title: "No Results",
          description: "No analysis results to save",
          variant: "destructive",
        });
        return;
      }

      // Create result object
      const resultToSave = {
        _id: Date.now().toString(),
        user_id: user.uid,
        disease_name: analysisResult.disease,
        confidence: analysisResult.confidence,
        description: analysisResult.description,
        symptoms: analysisResult.symptoms,
        causes: analysisResult.causes,
        prevention: analysisResult.prevention,
        medicines: analysisResult.medicines,
        image_url: selectedImage,
        created_at: new Date().toISOString(),
      };

      // Get existing results from local storage
      const savedResultsKey = `savedResults_${user.uid}`;
      const existingResults = localStorage.getItem(savedResultsKey);
      let results = existingResults ? JSON.parse(existingResults) : [];

      // Add new result
      results.push(resultToSave);

      // Save back to local storage
      localStorage.setItem(savedResultsKey, JSON.stringify(results));

      toast({
        title: "Success",
        description: "Detection results saved successfully!",
      });
    } catch (error) {
      console.error('Error saving results:', error);
      toast({
        title: "Error",
        description: "Failed to save results. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('back')}
        </Button>
        <h2 className="text-2xl font-bold text-foreground">{t('cropScanner')}</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              {t('uploadImage')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedImage ? (
              <div className="space-y-4">
                <img
                  src={selectedImage}
                  alt="Selected crop"
                  className="w-full h-64 object-cover rounded-lg border"
                />
                <div className="flex gap-2">
                  <Button onClick={analyzeCrop} variant="scan" disabled={isAnalyzing} className="flex-1">
                    {isAnalyzing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Scan className="h-4 w-4 mr-2" />}
                    {isAnalyzing ? t('analyzing') : t('analyzeCrop')}
                  </Button>
                  <Button onClick={() => { setSelectedImage(null); setSelectedFile(null); }} variant="outline">
                    {t('clear')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">{t('dragDrop')}</p>
                  <div className="flex flex-col gap-2">
                    <Button onClick={captureFromCamera} variant="farmer">
                      <Camera className="h-4 w-4 mr-2" />
                      Capture from Camera
                    </Button>
                    <Button onClick={handleUploadButtonClick} variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      {t('uploadImage')}
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      ref={fileInputRef}
                      data-testid="file-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('analysisResults')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 border-b-2 border-primary mx-auto mb-4 animate-spin" />
                  <p className="text-muted-foreground">{t('analyzing')}</p>
                </div>
              </div>
            ) : analysisResult ? (
              analysisResult.disease.toLowerCase() === 'normal' ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <h3 className="text-2xl font-bold text-green-600 mb-2">{t('cropIsHealthy')}</h3>
                  <p className="text-muted-foreground">{t('noDisease')}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-earth p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-foreground mb-2">{analysisResult.disease}</h3>
                    <p className="text-sm text-muted-foreground">{t('confidence')}: {analysisResult.confidence}%</p>
                  </div>

                  {analysisResult.description && (
                    <div>
                      <h4 className="font-semibold mb-2">{t('description')}:</h4>
                      <p className="text-sm text-muted-foreground">{analysisResult.description}</p>
                    </div>
                  )}

                  {analysisResult.symptoms && analysisResult.symptoms.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">{t('symptomsDetected')}:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {analysisResult.symptoms.map((symptom: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground">{symptom}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysisResult.causes && analysisResult.causes.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">{t('causes')}:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {analysisResult.causes.map((cause: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground">{cause}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysisResult.prevention && analysisResult.prevention.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">{t('preventionTips')}:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {analysisResult.prevention.map((tip: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysisResult.medicines && analysisResult.medicines.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">{t('recommendedMedicines')}:</h4>
                      <div className="space-y-3">
                        {analysisResult.medicines.map((medicine: Medicine, index: number) => (
                          <div
                            key={index}
                            className="bg-success/10 p-3 rounded-lg border border-success/20 cursor-pointer hover:bg-success/20 transition-colors"
                            onClick={() => handleMedicineClick(medicine)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {medicine.priority === 1 && (
                                    <div className="w-5 h-5 flex-shrink-0">
                                      <svg width="20px" height="20px" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="iconify iconify--noto" preserveAspectRatio="xMidYMid meet">
                                        <path d="M69.09 4.24c-1.08.96-9.48 17.63-9.48 17.63l-6.25 25.21l24.32-2.23S97.91 7.23 98.32 6.36c.73-1.58 1.12-2.23-1.67-2.23c-2.79-.01-26.55-.79-27.56.11z" fill="#176cc7"></path>
                                        <path d="M81.68 43.29c-1.21-.65-36.85-1.21-37.69 0c-.76 1.1-.65 6.13-.28 6.78c.37.65 12.35 6.22 12.35 6.22l-.01 2.03s.66 1.59 7.34 1.59s7.37-1.35 7.37-1.35l.06-2.05s10.49-5.24 11.04-5.7c.56-.47 1.03-6.87-.18-7.52zM70.7 51.62s-.03-1.4-.72-1.75c-.69-.35-11.8-.29-12.74-.24c-.94.05-.94 1.73-.94 1.73l-7.6-3.7v-.74l28.3.2l.05.84l-6.35 3.66z" fill="#fcc417"></path>
                                        <path d="M59.26 51.17c-.94 0-1.48.98-1.48 2.67c0 1.58.54 2.91 1.73 2.81c.98-.08 1.32-1.58 1.23-2.91c-.09-1.58-.29-2.57-1.48-2.57z" fill="#fdffff"></path>
                                        <path d="M28.98 90.72c0 23.96 21.66 34.63 36.06 34.12c15.88-.57 34.9-12.95 33.75-35.81C97.7 67.37 79.48 57.1 63.7 57.21c-18.34.13-34.72 12.58-34.72 33.51z" fill="#fcc417"></path>
                                        <path d="M64.53 120.67c-.25 0-.51 0-.76-.01c-7.5-.25-14.91-3.41-20.33-8.66c-5.8-5.62-8.98-13.22-8.94-21.39c.09-19.95 17.53-29.2 29.36-29.2h.1c16.03.07 29.19 12.53 29.56 29.42c.16 7.52-2.92 15.41-8.96 21.35c-5.64 5.53-13.12 8.49-20.03 8.49zm-.69-55.94c-10.61 0-26.3 8.68-26.34 25.88c-.03 12.86 9.93 26.08 26.52 26.64c6.32.2 12.83-2.22 18.09-7.39c5.46-5.37 8.53-12.29 8.42-18.99c-.24-14.53-12.12-26.09-26.54-26.15c-.04 0-.12.01-.15.01z" fill="#fa912c"></path>
                                        <path d="M57.82 60.61c-.69-.95-8.51-.77-15.9 6.45c-7.13 6.97-7.9 13.54-6.53 13.92c1.55.43 3.44-6.53 9.97-12.38c6-5.36 13.84-6.1 12.46-7.99z" fill="#fefffa"></path>
                                        <path d="M88.07 86.48c-2.41.34.09 7.56-5.5 15.64c-4.85 7.01-10.35 9.55-9.71 11.09c.86 2.06 9.67-3.07 13.75-11.43c3.7-7.57 3.26-15.56 1.46-15.3z" fill="#fefffa"></path>
                                        <path d="M55.85 77.02c-.52.77-.05 7.52.26 7.82c.6.6 5.16-1.55 5.16-1.55l-.17 18.05s-3.35-.04-3.7.09c-.69.26-.6 7.22-.09 7.56s14.18.52 14.7-.17c.52-.69.39-6.78.15-7.06c-.43-.52-3.7-.31-3.7-.31s.28-26.58.19-27.43s-1.03-1.38-2.15-1.12s-10.32 3.62-10.65 4.12z" fill="#fa912c"></path>
                                        <path d="M25.51 3.72c-.63.58 23.46 43.48 23.46 43.48s4.04.52 13.06.6s13.49-.52 13.49-.52S56.79 4.15 55.67 3.72c-.55-.22-7.97-.3-15.22-.38c-7.26-.09-14.34-.18-14.94.38z" fill="#2e9df4"></path>
                                      </svg>
                                    </div>
                                  )}
                                  <h5 className="font-medium text-success">{medicine.name}</h5>
                                </div>
                                {medicine.brand && (
                                  <p className="text-xs text-muted-foreground">Brand: {medicine.brand}</p>
                                )}
                                {medicine.application_rate && (
                                  <p className="text-sm text-muted-foreground">{t('dosage')}: {medicine.application_rate}</p>
                                )}
                                {medicine.frequency && (
                                  <p className="text-sm text-muted-foreground">{t('application')}: {medicine.frequency}</p>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground ml-2">
                                Click for details →
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button variant="farmer" className="w-full" onClick={saveResults}>
                    {t('saveResults')}
                  </Button>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Upload an image to see analysis results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Medicine Details Modal */}
      <Dialog open={isMedicineModalOpen} onOpenChange={setIsMedicineModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-success" />
              Medicine Details
            </DialogTitle>
          </DialogHeader>

          {selectedMedicine && (
            <div className="space-y-6">
              {/* Header with Image */}
              <div className="flex gap-4">
                {selectedMedicine.image_url && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={selectedMedicine.image_url}
                      alt={selectedMedicine.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-success">{selectedMedicine.name}</h3>
                  {selectedMedicine.brand && (
                    <p className="text-sm text-muted-foreground">Brand: {selectedMedicine.brand}</p>
                  )}
                  {selectedMedicine.type && (
                    <p className="text-sm text-muted-foreground">Type: {selectedMedicine.type}</p>
                  )}
                </div>
              </div>

              {/* Product Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedMedicine.active_ingredient && (
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">Active Ingredient</h4>
                    <p className="text-sm text-muted-foreground">{selectedMedicine.active_ingredient}</p>
                  </div>
                )}

                {selectedMedicine.pack_size && (
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      Pack Size
                    </h4>
                    <p className="text-sm text-muted-foreground">{selectedMedicine.pack_size}</p>
                  </div>
                )}

                {selectedMedicine.price && (
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Price
                    </h4>
                    <p className="text-sm text-muted-foreground">{selectedMedicine.price}</p>
                  </div>
                )}

                {selectedMedicine.availability && (
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">Availability</h4>
                    <p className="text-sm text-muted-foreground">{selectedMedicine.availability}</p>
                  </div>
                )}
              </div>

              {/* Application Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg border-b pb-2">Application Details</h4>

                {selectedMedicine.application_rate && (
                  <div className="space-y-1">
                    <h5 className="font-medium text-sm">Dosage</h5>
                    <p className="text-sm text-muted-foreground">{selectedMedicine.application_rate}</p>
                  </div>
                )}

                {selectedMedicine.method && (
                  <div className="space-y-1">
                    <h5 className="font-medium text-sm">Method</h5>
                    <p className="text-sm text-muted-foreground">{selectedMedicine.method}</p>
                  </div>
                )}

                {selectedMedicine.frequency && (
                  <div className="space-y-1">
                    <h5 className="font-medium text-sm flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Frequency
                    </h5>
                    <p className="text-sm text-muted-foreground">{selectedMedicine.frequency}</p>
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              {selectedMedicine.note && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    Important Notes
                  </h4>
                  <div className="bg-warning/10 p-3 rounded-lg border border-warning/20">
                    <p className="text-sm text-muted-foreground">{selectedMedicine.note}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
