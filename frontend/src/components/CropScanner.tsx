import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Scan, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import infectedCrop from '@/assets/infected-crop.jpg';

interface CropScannerProps {
  onBack: () => void;
}

export const CropScanner: React.FC<CropScannerProps> = ({ onBack }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis delay
    setTimeout(() => {
      setAnalysisResult({
        disease: 'Leaf Blight',
        confidence: 85,
        symptoms: ['Yellow spots on leaves', 'Brown edges', 'Wilting'],
        treatments: [
          {
            name: 'Copper Fungicide',
            dosage: '2ml per liter of water',
            application: 'Spray on affected areas twice weekly'
          },
          {
            name: 'Neem Oil',
            dosage: '5ml per liter of water',
            application: 'Apply during evening hours'
          }
        ],
        prevention: [
          'Ensure proper drainage',
          'Avoid overhead watering',
          'Remove affected leaves immediately'
        ]
      });
      setIsAnalyzing(false);
      toast.success('Crop analysis completed!');
    }, 3000);
  };

  const takeDemoPhoto = () => {
    setSelectedImage(infectedCrop);
    setAnalysisResult(null);
    toast.success('Demo photo captured!');
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
                  <Button onClick={simulateAnalysis} variant="scan" disabled={isAnalyzing} className="flex-1">
                    <Scan className="h-4 w-4 mr-2" />
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Crop'}
                  </Button>
                  <Button onClick={() => setSelectedImage(null)} variant="outline">
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
                    <label className="cursor-pointer">
                      <Button variant="outline" className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
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
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Analyzing your crop image...</p>
                </div>
              </div>
            ) : analysisResult ? (
              <div className="space-y-6">
                <div className="bg-gradient-earth p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-foreground mb-2">{analysisResult.disease}</h3>
                  <p className="text-sm text-muted-foreground">Confidence: {analysisResult.confidence}%</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Symptoms Detected:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {analysisResult.symptoms.map((symptom: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground">{symptom}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Recommended Treatments:</h4>
                  <div className="space-y-3">
                    {analysisResult.treatments.map((treatment: any, index: number) => (
                      <div key={index} className="bg-success/10 p-3 rounded-lg border border-success/20">
                        <h5 className="font-medium text-success">{treatment.name}</h5>
                        <p className="text-sm text-muted-foreground">Dosage: {treatment.dosage}</p>
                        <p className="text-sm text-muted-foreground">Application: {treatment.application}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Prevention Tips:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {analysisResult.prevention.map((tip: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground">{tip}</li>
                    ))}
                  </ul>
                </div>

                <Button variant="farmer" className="w-full">
                  Save Results
                </Button>
              </div>
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