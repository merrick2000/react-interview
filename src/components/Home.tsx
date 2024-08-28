import React, { useState, useEffect } from "react";
import {
    Box,
    Flex,
    Input,
    VStack,
    Select,
    Button,
    Text,
    Spinner,
    Heading,
    Divider,
    useToast,
} from "@chakra-ui/react";
import { Card } from "@components/design/Card";
import {
    searchSchoolDistricts,
    searchSchools,
    NCESDistrictFeatureAttributes,
    NCESSchoolFeatureAttributes,
} from "@utils/nces";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import schoolIcon from '../school.svg';

// Replace with your Google Maps API key from .env
const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

const Home: React.FC = () => {
    const [searching, setSearching] = useState(false);
    const [districtSearch, setDistrictSearch] = useState<NCESDistrictFeatureAttributes[]>([]);
    const [filteredDistricts, setFilteredDistricts] = useState<NCESDistrictFeatureAttributes[]>([]);
    const [schoolSearch, setSchoolSearch] = useState<NCESSchoolFeatureAttributes[]>([]);
    const [districtQuery, setDistrictQuery] = useState("");
    const [schoolQuery, setSchoolQuery] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState<NCESDistrictFeatureAttributes | null>(null);
    const [selectedSchool, setSelectedSchool] = useState<NCESSchoolFeatureAttributes | null>(null);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<NCESSchoolFeatureAttributes | null>(null);
    const toast = useToast();

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: googleMapsKey || '',
    });

    const handleDistrictSearch = async () => {
        setSearching(true);
        try {
            const results = await searchSchoolDistricts(districtQuery);
            setDistrictSearch(results);
            setFilteredDistricts(results);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch districts.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        setSearching(false);
    };

    useEffect(() => {
        if (selectedDistrict) {
            handleSchoolSearch();
            // Update map center to the selected district's location
            setMapCenter({
                lat: selectedDistrict.LAT1516,
                lng: selectedDistrict.LON1516,
            });
        }
    }, [selectedDistrict]);

    const handleSchoolSearch = async () => {
        if (!selectedDistrict) return;
        setSearching(true);
        try {
            const results = await searchSchools(schoolQuery, selectedDistrict.LEAID);
            setSchoolSearch(results);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch schools.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        setSearching(false);
    };

    return (
        <Flex direction="column" p={8} height="100vh" gap={4}>
            <Heading>School Data Finder</Heading>
            <Divider />

            <Flex direction={{ base: "column", md: "row" }} gap={4} flex="1">
                {/* Colonne 1: Recherche et Sélection de District */}
                <VStack flex="1" spacing={4}>
                    <Input
                        placeholder="Search for a district"
                        value={districtQuery}
                        onChange={(e) => setDistrictQuery(e.target.value)}
                    />
                    <Button onClick={handleDistrictSearch} isLoading={searching}>
                        Search District
                    </Button>

                    <Select
                        placeholder="Select a district"
                        onChange={(e) => {
                            const district = filteredDistricts.find(d => d.LEAID === e.target.value);
                            setSelectedDistrict(district || null);
                            setSelectedSchool(null);
                        }}
                    >
                        {filteredDistricts.map(district => (
                            <option key={district.LEAID} value={district.LEAID}>
                                {district.NAME}
                            </option>
                        ))}
                    </Select>
                </VStack>

                {/* Colonne 2: Recherche et Sélection d'École */}
                <VStack flex="1" spacing={4} visibility={selectedDistrict ? "visible" : "hidden"}>
                    <Input
                        placeholder="Search for a school"
                        value={schoolQuery}
                        onChange={(e) => setSchoolQuery(e.target.value)}
                        disabled={!selectedDistrict}
                    />
                    <Button onClick={handleSchoolSearch} isLoading={searching}>
                        Search School
                    </Button>

                    <Select
                        placeholder="Select a school"
                        onChange={(e) => {
                            const school = schoolSearch.find(s => s?.NCESSCH === e.target.value);
                            setSelectedSchool(school || null);
                        }}
                        disabled={!selectedDistrict}
                    >
                        {schoolSearch.map(school => (
                            <option key={school?.NCESSCH} value={school?.NCESSCH}>
                                {school?.NAME}
                            </option>
                        ))}
                    </Select>
                </VStack>

                {/* Colonne 3: Détails de l'École */}
                <Box flex="1" borderWidth={1} borderRadius="md" p={4} visibility={selectedSchool ? "visible" : "hidden"}>
                    {selectedSchool ? (
                        <>
                            <Heading size="md">{selectedSchool?.NAME}</Heading>
                            <Text>Street: {selectedSchool?.STREET}</Text>
                            <Text>City: {selectedSchool?.CITY}</Text>
                            <Text>State: {selectedSchool?.STATE}</Text>
                            <Text>ZIP: {selectedSchool?.ZIP}</Text>
                            {/* Ajouter d'autres détails pertinents */}
                        </>
                    ) : (
                        <Text>Select a school to view details</Text>
                    )}
                </Box>
            </Flex>

            {/* Carte Google Maps */}
            {isLoaded && mapCenter && (
                <Box flex="1" borderWidth={1} borderRadius="md" p={4}>
                    <GoogleMap
                        mapContainerStyle={{ height: "400px", width: "100%" }}
                        center={mapCenter}
                        zoom={12}
                    >
                        {schoolSearch.map(school => (
                            <Marker
                                key={school?.NCESSCH}
                                position={{ lat: school?.LAT || 0, lng: school?.LON || 0 }}
                                icon={schoolIcon}  // Custom icon
                                onClick={() => setSelectedMarker(school)}
                            />
                        ))}
                        {selectedMarker && (
                            <InfoWindow
                                position={{
                                    lat: selectedMarker?.LAT || 0,
                                    lng: selectedMarker?.LON || 0,
                                }}
                                onCloseClick={() => setSelectedMarker(null)}
                            >
                                <Box p={2}>
                                    <Heading size="sm">{selectedMarker?.NAME}</Heading>
                                    <Text>Street: {selectedMarker?.STREET}</Text>
                                    <Text>City: {selectedMarker?.CITY}</Text>
                                    <Text>State: {selectedMarker?.STATE}</Text>
                                    <Text>ZIP: {selectedMarker?.ZIP}</Text>
                                    {/* Replace YEAR with the actual field if it's different */}
                                </Box>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </Box>
            )}
        </Flex>
    );
};

export default Home;
