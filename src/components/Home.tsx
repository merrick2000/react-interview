import React, { useState, useEffect } from "react";
import {
    Box,
    Flex,
    Input,
    VStack,
    HStack,
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
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import schoolIcon from "../school.svg";

const Home: React.FC = () => {
    const [searching, setSearching] = useState(false);
    const [districtSearch, setDistrictSearch] = useState<NCESDistrictFeatureAttributes[]>([]);
    const [filteredDistricts, setFilteredDistricts] = useState<NCESDistrictFeatureAttributes[]>([]);
    const [schoolSearch, setSchoolSearch] = useState<NCESSchoolFeatureAttributes[]>([]);
    const [districtQuery, setDistrictQuery] = useState("");
    const [schoolQuery, setSchoolQuery] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState<NCESDistrictFeatureAttributes | null>(null);
    const [selectedSchool, setSelectedSchool] = useState<NCESSchoolFeatureAttributes | null>(null);
    const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral | null>(null); // Center of the map
    const [zoomLevel, setZoomLevel] = useState<number>(10); // Zoom level of the map
    const toast = useToast();

    const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

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
            // Set map center and zoom out when district is selected
            setMapCenter({
                lat: selectedDistrict?.LAT1516 || 0,
                lng: selectedDistrict?.LON1516 || 0
            });
            setZoomLevel(12);
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

    useEffect(() => {
        if (selectedSchool) {
            setMapCenter({
                lat: selectedSchool?.LAT || 0,
                lng: selectedSchool?.LON || 0
            });
            setZoomLevel(15);
        }
    }, [selectedSchool]);

    return (
        <Flex direction="column" p={8} height="100vh" gap={4}>
            <Heading>School Data Finder</Heading>
            <Divider />

            <Flex direction={{ base: "column", md: "row" }} gap={4} flex="1">
                {/* Column 1: District Search and Selection */}
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
                            setSelectedSchool(null); // Reset school selection
                            setMapCenter(null); // Reset map center
                        }}
                    >
                        {filteredDistricts.map(district => (
                            <option key={district.LEAID} value={district.LEAID}>
                                {district.NAME}
                            </option>
                        ))}
                    </Select>
                </VStack>

                {/* Column 2: School Search and Selection */}
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

                {/* Column 3: School Details */}
                <Box flex="1" borderWidth={1} borderRadius="md" p={4} visibility={selectedSchool ? "visible" : "hidden"}>
                    {selectedSchool ? (
                        <>
                            <Heading size="md">{selectedSchool?.NAME}</Heading>
                            <Text>City: {selectedSchool?.CITY}</Text>
                            <Text>State: {selectedSchool?.STATE}</Text>
                            <Text>ZIP: {selectedSchool?.ZIP}</Text>
                            <Text>Street: {selectedSchool?.STREET}</Text>
                            <Text>County: {selectedSchool?.CNTY}</Text>
                        </>
                    ) : (
                        <Text>Select a school to view details</Text>
                    )}
                </Box>
            </Flex>

            {/* Google Map */}
            <Box flex="1" borderWidth={1} borderRadius="md" overflow="hidden">
                {isLoaded && (
                    <GoogleMap
                        center={mapCenter || { lat: 0, lng: 0 }}
                        zoom={zoomLevel}
                        mapContainerStyle={{ height: "100%", width: "100%" }}
                    >
                        {selectedDistrict && schoolSearch.map(school => (
                            <Marker
                                key={school?.NCESSCH}
                                position={{ lat: school?.LAT || 0, lng: school?.LON || 0 }}
                                icon={schoolIcon}
                                onClick={() => {
                                    setSelectedSchool(school);
                                    setMapCenter({
                                        lat: school?.LAT || 0,
                                        lng: school?.LON || 0
                                    });
                                    setZoomLevel(15);
                                }}
                            />
                        ))}
                    </GoogleMap>
                )}
            </Box>
        </Flex>
    );
};

export default Home;
