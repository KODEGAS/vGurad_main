import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Separator } from '@/components/ui/separator';

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
                                      <svg width="20px" height="20px" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet">
                                        <defs>
                                          <style>
                                            {`.st0{fill:#464646;stroke:#FFD700;stroke-width:4;}
                                            .st1{fill:#D1D1D1;stroke:#FFD700;stroke-width:4;}`}
                                          </style>
                                        </defs>
                                        <path className="st1" d="M243.207,80.209c-2.648-3.627-6.917-5.707-11.707-5.707c-1.749,0-3.566,0.273-5.4,0.813l-37.591,11.046
	c-9.815,2.885-16.771,12.763-16.178,22.977l1.097,18.824h-10.914l5.639-19.97c2.273-8.05,0.699-19.037-3.744-26.126l-22.821-36.404
	c-3.259-5.199-8.28-8.181-13.776-8.181c-5.505,0-10.53,2.99-13.787,8.203L91.294,82.07c-4.427,7.087-5.998,18.069-3.734,26.114
	l5.621,19.978H82.376l1.092-18.824c0.592-10.21-6.359-20.09-16.167-22.983L29.908,75.327c-1.84-0.542-3.663-0.818-5.416-0.818
	c-4.787,0-9.052,2.078-11.702,5.702c-2.874,3.93-3.514,9.058-1.802,14.44l28.557,89.794c1.099,3.455,3.109,6.593,5.694,9.188
	c-4.013,3.059-6.489,7.374-6.489,12.242c0,9.48,9.346,16.907,21.277,16.907h131.946c11.932,0,21.276-7.427,21.276-16.907
	c0-4.012-1.688-7.646-4.521-10.516c3.504-2.866,6.25-6.643,7.608-10.902l28.661-89.8C246.717,89.273,246.081,84.143,243.207,80.209z"/>
                                        <g>
                                          <path className="st0" d="M191.973,198.968H60.027c-6.202,0-11.277,3.108-11.277,6.907s5.074,6.907,11.277,6.907h131.946
		c6.202,0,11.277-3.108,11.277-6.907S198.175,198.968,191.973,198.968z"/>
                                          <path className="st0" d="M228.918,84.91l-37.59,11.046c-5.277,1.551-9.333,7.312-9.014,12.802l1.129,19.421
		c0.32,5.491-3.918,9.983-9.418,9.983h-14.728c-5.5,0-8.776-4.33-7.282-9.623l6.512-23.065c1.496-5.293,0.328-13.437-2.594-18.096
		l-22.82-36.404c-2.922-4.66-7.695-4.656-10.609,0.009L99.775,87.368c-2.914,4.665-4.079,12.813-2.59,18.108l6.488,23.059
		c1.489,5.295-1.792,9.627-7.292,9.627H81.779c-5.5,0-9.739-4.492-9.421-9.983l1.126-19.42c0.318-5.491-3.737-11.256-9.013-12.812
		L27.079,84.919c-5.275-1.556-8.229,1.46-6.562,6.701l28.557,89.794c1.667,5.24,7.53,9.529,13.03,9.529h55.697c5.5,0,14.5,0,20,0
		h55.971c5.5,0,11.367-4.287,13.039-9.526c7.166-22.45,28.662-89.8,28.662-89.8C237.145,86.377,234.195,83.359,228.918,84.91z
		 M84.167,179.223c-5.615,0-10.167-4.552-10.167-10.166c0-5.615,4.552-10.168,10.167-10.168c5.615,0,10.167,4.553,10.167,10.168
		C94.334,174.671,89.782,179.223,84.167,179.223z M128,176.572l-16-16.001l15.999-16L144,160.572L128,176.572z M171.834,178.891
		c-5.432,0-9.834-4.402-9.834-9.834c0-5.433,4.402-9.834,9.834-9.834s9.834,4.401,9.834,9.834
		C181.668,174.488,177.266,178.891,171.834,178.891z"/>
                                        </g>
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
                              <div className="flex flex-col items-end text-right ml-2">
                                {medicine.image_url && (
                                  <img
                                    src={medicine.image_url}
                                    alt={medicine.name}
                                    className="w-12 h-12 object-cover rounded-md mb-1"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                )}
                                <span className="text-xs text-muted-foreground">
                                  Click for details →
                                </span>
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
                  
                  <Separator className="my-8 bg-white/20" />
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
