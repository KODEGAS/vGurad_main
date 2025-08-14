import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';

const SeedPricing: React.FC = () => {
    const { t, language } = useTranslation();

    const registeredSeedData = [
        {
            variety: {
                en: "Keeri Samba BG 360",
                si: "කීරී සම්බා BG 360",
                ta: "கீரி சம்பா BG 360"
            },
            price1kg: 310.00,
            price2kg: 620.00,
            price5kg: 1550.00,
            price10kg: 3100.00,
            priceBushel: 6000.00,
            dateValid: "2025-07-23"
        },
        {
            variety: {
                en: "Nadu (White/Red)",
                si: "නාඩු (සුදු/රතු)",
                ta: "நாடு (வெள்ளை/சிவப்பு)"
            },
            price1kg: 290.00,
            price2kg: 580.00,
            price5kg: 1450.00,
            price10kg: 2900.00,
            priceBushel: 5800.00,
            dateValid: "2025-07-23"
        },
        {
            variety: {
                en: "Samba (Red/White)",
                si: "සම්බා (සුදු/රතු)",
                ta: "சம்பா (வெள்ளை/சிவப்பு)"
            },
            price1kg: 300.00,
            price2kg: 600.00,
            price5kg: 1500.00,
            price10kg: 3000.00,
            priceBushel: 5900.00,
            dateValid: "2025-07-23"
        }
    ];

    const certifiedSeedData = [
        {
            variety: {
                en: "Keeri Samba BG 360",
                si: "කීරී සම්බා BG 360",
                ta: "கீரி சம்பா BG 360"
            },
            price1kg: 260.00,
            price2kg: 520.00,
            price5kg: 1300.00,
            price10kg: 2600.00,
            priceBushel: 4600.00,
            dateValid: "2025-07-23"
        },
        {
            variety: {
                en: "Nadu (White/Red)",
                si: "නාඩු (සුදු/රතු)",
                ta: "நாடு (வெள்ளை/சிவப্পு)"
            },
            price1kg: 240.00,
            price2kg: 480.00,
            price5kg: 1200.00,
            price10kg: 2400.00,
            priceBushel: 4300.00,
            dateValid: "2025-07-23"
        },
        {
            variety: {
                en: "Samba (Red/White)",
                si: "සම්බා (සුදු/රතු)",
                ta: "சம்பா (வெள்ளை/சிவப্পু)"
            },
            price1kg: 245.00,
            price2kg: 490.00,
            price5kg: 1225.00,
            price10kg: 2450.00,
            priceBushel: 4400.00,
            dateValid: "2025-07-23"
        }
    ];

    const purchasingPriceData = [
        {
            variety: {
                en: "Keeri Samba BG 360",
                si: "කීරී සම්බා BG 360",
                ta: "கீரி சம்பா BG 360"
            },
            priceBushel: 4300.00,
            dateValid: "2025-07-23"
        },
        {
            variety: {
                en: "Nadu (White/Red)",
                si: "නාඩු (සුදු/රතු)",
                ta: "நாடு (வெள்ளை/சிவপ্পু)"
            },
            priceBushel: 4100.00,
            dateValid: "2025-07-23"
        },
        {
            variety: {
                en: "Samba (White/Red)",
                si: "සම්බා (සුදු/රතු)",
                ta: "சம்பா (வெள்ளை/சிவപ্পু)"
            },
            priceBushel: 4200.00,
            dateValid: "2025-07-23"
        }
    ];

    const formatPrice = (price: number) => {
        return `Rs. ${new Intl.NumberFormat('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price)}`;
    };

    // Helper function to get variety name in current language
    const getVarietyName = (variety: { en: string; si: string; ta: string }) => {
        return variety[language] || variety.en;
    };

    return (
        <div className="container mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-8 max-w-7xl">
            {/* Enhanced Header Section */}
            <div className="mb-6 md:mb-12 text-center">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-6 bg-gradient-to-r from-primary to-crop-primary bg-clip-text text-transparent animate-fade-in">
                    {t({
                        en: "Paddy Seed Pricing",
                        si: "වී බීජ මිල ගණන්",
                        ta: "நெல் விதை விலை"
                    })}
                </h1>
                <p className="text-sm md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed animate-slide-in-up px-2">
                    {t({
                        en: "Current market prices for registered and certified paddy seeds. Prices are updated regularly based on market conditions.",
                        si: "ලියාපදිංචි සහ සහතික වී බීජ සඳහා වර්තමාන වෙළඳපල මිල ගණන්. වෙළඳපල තත්ත්වයන් මත පදනම්ව මිල ගණන් නිතිපතා යාවත්කාලීන කරනු ලැබේ.",
                        ta: "பதிவு செய்யப்பட்ட மற்றும் சான்றளிக்கப்பட்ட நெல் விதைகளுக்கான தற்போதைய சந்தை விலைகள். சந்தை நிலைமைகளின் அடிப்படையில் விலைகள் தொடர்ந்து புதுப்பிக்கப்படுகின்றன."
                    })}
                </p>
            </div>

            {/* Registered Seeds Selling Price */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {t({
                                en: "Registered",
                                si: "ලියාපදිංචි",
                                ta: "பதிவு செய்த"
                            })}
                        </Badge>
                        <span>
                            {t({
                                en: "Selling Price",
                                si: "අලෙවි මිල",
                                ta: "விற்பனை விலை"
                            })}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">
                                        {t({
                                            en: "Variety/Group",
                                            si: "ප්‍රභේදය/කණ්ඩායම",
                                            ta: "வகை/குழு"
                                        })}
                                    </TableHead>
                                    <TableHead className="text-right">
                                        {t({
                                            en: "1kg Price",
                                            si: "කිලෝ 1 මිල",
                                            ta: "1 கிலோ விலை"
                                        })}
                                    </TableHead>
                                    <TableHead className="text-right">
                                        {t({
                                            en: "2kg Price",
                                            si: "කිලෝ 2 මිල",
                                            ta: "2 கிலோ விலை"
                                        })}
                                    </TableHead>
                                    <TableHead className="text-right">
                                        {t({
                                            en: "5kg Price",
                                            si: "කිලෝ 5 මිල",
                                            ta: "5 கிলோ விலை"
                                        })}
                                    </TableHead>
                                    <TableHead className="text-right">
                                        {t({
                                            en: "10kg Price",
                                            si: "කිලෝ 10 මිල",
                                            ta: "10 கிলோ விலை"
                                        })}
                                    </TableHead>
                                    <TableHead className="text-right">
                                        {t({
                                            en: "1 Bushel",
                                            si: "බුෂල් 1",
                                            ta: "1 புஷல்"
                                        })}
                                    </TableHead>
                                    <TableHead className="text-center">
                                        {t({
                                            en: "Valid From",
                                            si: "වලංගු දිනය",
                                            ta: "செல்லுபடியாகும் தேতি"
                                        })}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {registeredSeedData.map((seed, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">
                                            {getVarietyName(seed.variety)}
                                        </TableCell>
                                        <TableCell className="text-right">{formatPrice(seed.price1kg)}</TableCell>
                                        <TableCell className="text-right">{formatPrice(seed.price2kg)}</TableCell>
                                        <TableCell className="text-right">{formatPrice(seed.price5kg)}</TableCell>
                                        <TableCell className="text-right">{formatPrice(seed.price10kg)}</TableCell>
                                        <TableCell className="text-right">{formatPrice(seed.priceBushel)}</TableCell>
                                        <TableCell className="text-center">{seed.dateValid}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Separator className="my-8" />

            {/* Certified Seeds Selling Price */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {t({
                                en: "Certified",
                                si: "සහතික",
                                ta: "சான்றளிக்கப்பட்ட"
                            })}
                        </Badge>
                        <span>
                            {t({
                                en: "Selling Price",
                                si: "අලෙවි මිල",
                                ta: "விற்பனை விலை"
                            })}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">
                                        {t({
                                            en: "Variety/Group",
                                            si: "ප්‍රභේදය/කණ්ඩායම",
                                            ta: "வகை/குழு"
                                        })}
                                    </TableHead>
                                    <TableHead className="text-right">
                                        {t({
                                            en: "1kg Price",
                                            si: "කිලෝ 1 මිල",
                                            ta: "1 கிலோ விலை"
                                        })}
                                    </TableHead>
                                    <TableHead className="text-right">
                                        {t({
                                            en: "2kg Price",
                                            si: "කිලෝ 2 මිල",
                                            ta: "2 கிலோ விலை"
                                        })}
                                    </TableHead>
                                    <TableHead className="text-right">
                                        {t({
                                            en: "5kg Price",
                                            si: "කිලෝ 5 මිල",
                                            ta: "5 கிலோ விலை"
                                        })}
                                    </TableHead>
                                    <TableHead className="text-right">
                                        {t({
                                            en: "10kg Price",
                                            si: "කිලෝ 10 මිල",
                                            ta: "10 கிலோ விலை"
                                        })}
                                    </TableHead>
                                    <TableHead className="text-right">
                                        {t({
                                            en: "1 Bushel",
                                            si: "බුෂල් 1",
                                            ta: "1 புஷல்"
                                        })}
                                    </TableHead>
                                    <TableHead className="text-center">
                                        {t({
                                            en: "Valid From",
                                            si: "වලංගු දිනය",
                                            ta: "செல்லுபடியாகும் தேতி"
                                        })}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {certifiedSeedData.map((seed, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">
                                            {getVarietyName(seed.variety)}
                                        </TableCell>
                                        <TableCell className="text-right">{formatPrice(seed.price1kg)}</TableCell>
                                        <TableCell className="text-right">{formatPrice(seed.price2kg)}</TableCell>
                                        <TableCell className="text-right">{formatPrice(seed.price5kg)}</TableCell>
                                        <TableCell className="text-right">{formatPrice(seed.price10kg)}</TableCell>
                                        <TableCell className="text-right">{formatPrice(seed.priceBushel)}</TableCell>
                                        <TableCell className="text-center">{seed.dateValid}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Separator className="my-8" />

            {/* Certified Seeds Purchasing Price */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            {t({
                                en: "Certified",
                                si: "සහතික",
                                ta: "சான்றளிக்கப்பட்ட"
                            })}
                        </Badge>
                        <span>
                            {t({
                                en: "Purchasing Price",
                                si: "ගැනුම් මිල",
                                ta: "கொள்விலை"
                            })}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">
                                        {t({
                                            en: "Variety/Group",
                                            si: "ප්‍රභේදය/කණ්ඩායම",
                                            ta: "வகை/குழு"
                                        })}
                                    </TableHead>
                                    <TableHead className="text-right">
                                        {t({
                                            en: "Price for 1 Bushel",
                                            si: "බුෂල් 1 සඳහා මිල",
                                            ta: "1 புஷலுக்கான விலை"
                                        })}
                                    </TableHead>
                                    <TableHead className="text-center">
                                        {t({
                                            en: "Valid From",
                                            si: "වලංගු දිනය",
                                            ta: "செல்லுபடியாகும் தேতি"
                                        })}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {purchasingPriceData.map((seed, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">
                                            {getVarietyName(seed.variety)}
                                        </TableCell>
                                        <TableCell className="text-right">{formatPrice(seed.priceBushel)}</TableCell>
                                        <TableCell className="text-center">{seed.dateValid}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Information Note */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                            <span className="text-white text-base font-bold">i</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-blue-900 mb-4 text-lg">
                                {t({
                                    en: "Important Information",
                                    si: "වැදගත් තොරතුරු",
                                    ta: "முக்கியமான தகவல்"
                                })}
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="text-blue-600 font-bold text-lg leading-none mt-1">•</span>
                                    <p className="text-blue-800 text-sm leading-relaxed">
                                        {t({
                                            en: "Prices are subject to change based on market conditions and availability",
                                            si: "වෙළඳපල තත්ත්වයන් සහ ලබා ගත හැකිභාවය අනුව මිල ගණන් වෙනස් විය හැකිය",
                                            ta: "சந்தை நிலைமைகள் மற்றும் கிடைக்கும் தன்மையின் அடிப்படையில் விலைகள் மாறலாம்"
                                        })}
                                    </p>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="text-blue-600 font-bold text-lg leading-none mt-1">•</span>
                                    <p className="text-blue-800 text-sm leading-relaxed">
                                        {t({
                                            en: "All prices are in Sri Lankan Rupees (LKR)",
                                            si: "සියලු මිල ගණන් ශ්‍රී ලංකා රුපියල් (LKR) වලින් ය",
                                            ta: "எல்லா விலைகளும் இலங்கை ரூபாயில் (LKR)"
                                        })}
                                    </p>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="text-blue-600 font-bold text-lg leading-none mt-1">•</span>
                                    <p className="text-blue-800 text-sm leading-relaxed">
                                        {t({
                                            en: "Registered seeds are generally higher priced than certified seeds due to quality assurance",
                                            si: "ගුණාත්මක සහතිකය හේතුවෙන් ලියාපදිංචි බීජ සහතික බීජවලට වඩා සාමාන්‍යයෙන් ඉහළ මිලක් ගනී",
                                            ta: "தரக் காப்பீட்டின் காரணமாக பதிவு செய்யப்பட்ட விதைகள் பொதுவாக சான்றளிக்கப்பட்ட விதைகளை விட அதිக விலை கொண்டவை"
                                        })}
                                    </p>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="text-blue-600 font-bold text-lg leading-none mt-1">•</span>
                                    <p className="text-blue-800 text-sm leading-relaxed">
                                        {t({
                                            en: "Contact authorized dealers for bulk purchase discounts",
                                            si: "තොග මිලදී ගැනීම් සඳහා වට්ටම් සඳහා බලයලත් බෙදාහරින්නන් සම්බන්ධ කරගන්න",
                                            ta: "மொத்த கொள்முதல் தள்ளுபடிகளுக்கு அங்கீகரிக்கப்பட்ட வியாபாரிகளை தொடர்பு கொள்ளவும்"
                                        })}
                                    </p>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="text-blue-600 font-bold text-lg leading-none mt-1">•</span>
                                    <p className="text-blue-800 text-sm leading-relaxed">
                                        {t({
                                            en: "Prices valid from the specified date until further notice",
                                            si: "නිශ්චිත දිනයේ සිට ඊළඟ දැනුම්දීම දක්වා මිල ගණන් වලංගුය",
                                            ta: "குறிப்பிட்ட தேதியில் இருந்து மேலும் அறிவிப்பு வரை விலைகள் செல்லுபடியாகும்"
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SeedPricing;