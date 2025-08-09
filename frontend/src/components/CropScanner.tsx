import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Scan, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const DEMO_IMAGE_URL = 'https://placehold.co/600x400/8B4513/FFFFFF?text=Infected+Crop';


interface CropScannerProps {
  onBack: () => void;
}

interface Medicine {
  name: string;
  application_rate
: string;
  frequency: string;
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

  const fileInputRef = useRef<HTMLInputElement>(null);


  const API_BASE_URL = 'http://kodegas-paddy-api.centralindia.cloudapp.azure.com:8000';

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
      toast.error('Please select an image to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Step 1: Send image to prediction API
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

      // Step 2: Fetch detailed disease info and medicines in parallel
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
      toast.success('Crop analysis completed!');

    } catch (error) {
      console.error('Error during analysis:', error);
      toast.error('Failed to analyze crop. Please try again.');
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

  const takeDemoPhoto = async () => {
    try {
      const response = await fetch(DEMO_IMAGE_URL);
      const blob = await response.blob();
      const file = new File([blob], 'demo-image.png', { type: blob.type });
      setSelectedFile(file);
      setSelectedImage(DEMO_IMAGE_URL);
      setAnalysisResult(null);
      toast.success('Demo photo captured!');
    } catch (error) {
      console.error('Error fetching demo image:', error);
      toast.error('Failed to load demo image.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold text-foreground">Crop Disease Scanner</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Capture or Upload Image
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
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Crop'}
                  </Button>
                  <Button onClick={() => { setSelectedImage(null); setSelectedFile(null); }} variant="outline">
                    Clear
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Take a photo or upload an image of your crop</p>
                  <div className="flex flex-col gap-2">
                    <Button onClick={takeDemoPhoto} variant="farmer">
                      <Camera className="h-4 w-4 mr-2" />
                      Use Demo Photo
                    </Button>
                    <Button onClick={handleUploadButtonClick} variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      ref={fileInputRef}
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
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 border-b-2 border-primary mx-auto mb-4 animate-spin" />
                  <p className="text-muted-foreground">Analyzing your crop image...</p>
                </div>
              </div>
            ) : analysisResult ? (
              analysisResult.disease.toLowerCase() === 'normal' ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <h3 className="text-2xl font-bold text-green-600 mb-2">Crop is Healthy</h3>
                  <p className="text-muted-foreground">No disease detected. Your crop looks good!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-earth p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-foreground mb-2">{analysisResult.disease}</h3>
                    <p className="text-sm text-muted-foreground">Confidence: {analysisResult.confidence}%</p>
                  </div>

                  {analysisResult.description && (
                    <div>
                      <h4 className="font-semibold mb-2">Description:</h4>
                      <p className="text-sm text-muted-foreground">{analysisResult.description}</p>
                    </div>
                  )}
                  
                  {analysisResult.symptoms && analysisResult.symptoms.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Symptoms Detected:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {analysisResult.symptoms.map((symptom: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground">{symptom}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {analysisResult.causes && analysisResult.causes.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Causes:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {analysisResult.causes.map((cause: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground">{cause}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysisResult.prevention && analysisResult.prevention.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Prevention Tips:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {analysisResult.prevention.map((tip: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysisResult.medicines && analysisResult.medicines.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Recommended Medicines:</h4>
                      <div className="space-y-3">
                        {analysisResult.medicines.map((medicine: Medicine, index: number) => (
                          <div key={index} className="bg-success/10 p-3 rounded-lg border border-success/20">
                            <h5 className="font-medium text-success">{medicine.name}</h5>
                            <p className="text-sm text-muted-foreground">Dosage: {medicine.application_rate}</p>
                            <p className="text-sm text-muted-foreground">Application: {medicine.frequency}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button variant="farmer" className="w-full">
                    Save Results
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
    </div>
  );
};
