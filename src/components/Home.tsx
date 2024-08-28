import React, { useState, useEffect, useCallback } from "react";
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
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import {
    searchSchoolDistricts,
    searchSchools,
    NCESDistrictFeatureAttributes,
    NCESSchoolFeatureAttributes,
} from "@utils/nces";
import { useJsApiLoader } from "@react-google-maps/api";
import schoolIcon from "../assets/school.svg";
import { googleMapsKey } from "@utils/maps";

const mapContainerStyle = {
    width: "100%",
    height: "400px",
};

const defaultCenter = {
    lat: 39.8283,
    lng: -98.5795,
};

const Home: React.FC = () => {
    const [searching, setSearching] = useState(false);
    const [districtSearch, setDistrictSearch] = useState<NCESDistrictFeatureAttributes[]>([]);
    const [filteredDistricts, setFilteredDistricts] = useState<NCESDistrictFeatureAttributes[]>([]);
    const [schoolSearch, setSchoolSearch] = useState<NCESSchoolFeatureAttributes[]>([]);
    const [districtQuery, setDistrictQuery] = useState("");
    const [schoolQuery, setSchoolQuery] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState<NCESDistrictFeatureAttributes | null>(null);
    const [selectedSchool, setSelectedSchool] = useState<NCESSchoolFeatureAttributes | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<NCESSchoolFeatureAttributes | null>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const toast = useToast();

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: googleMapsKey as string,
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
        }
    }, [selectedDistrict]);

    const handleSchoolSearch = async () => {
        if (!selectedDistrict) return;
        setSearching(true);
        try {
            const results = await searchSchools(schoolQuery, selectedDistrict.LEAID);
            setSchoolSearch(results);
            if (results.length === 0) {
                toast({
                    title: "No Schools Found",
                    description: `No schools found in the district for the search term "${schoolQuery}".`,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Schools Found",
                    description: `${results.length} schools found in the district.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                if (map) {
                    const bounds = new google.maps.LatLngBounds();
                    results.forEach(school => {
                        if (school.LAT && school.LON) {
                            bounds.extend({ lat: school.LAT, lng: school.LON });
                        }
                    });
                    map.fitBounds(bounds);
                }
            }
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

    const handleMapLoad = (mapInstance: google.maps.Map) => {
        setMap(mapInstance);
    };

    const handleMarkerClick = (school: NCESSchoolFeatureAttributes) => {
        setSelectedMarker(school);
        if (school.LAT && school.LON) {
            map?.panTo({ lat: school.LAT, lng: school.LON });
            map?.setZoom(18);
        }
    };

    return (
        <Flex direction="column" p={8} height="100vh" gap={4}>
            <Heading>School Data Finder</Heading>
            <Divider />

            <Flex direction={{ base: "column", md: "row" }} gap={4} flex="1">
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
                            setSelectedMarker(null);
                        }}
                    >
                        {filteredDistricts.map(district => (
                            <option key={district.LEAID} value={district.LEAID}>
                                {district.NAME}
                            </option>
                        ))}
                    </Select>
                </VStack>

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
                            handleMarkerClick(school!);
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

                <Box flex="1" borderWidth={1} borderRadius="md" p={4} visibility={selectedSchool ? "visible" : "hidden"}>
                    {selectedSchool ? (
                        <>
                            <Heading size="md">{selectedSchool?.NAME}</Heading>
                            <Text>City: {selectedSchool?.CITY}</Text>
                            <Text>State: {selectedSchool?.STATE}</Text>
                            <Text>ZIP: {selectedSchool?.ZIP}</Text>
                            <Text>Street: {selectedSchool?.STREET}</Text>
                            <Text>County: {selectedSchool?.NMCNTY}</Text>
                        </>
                    ) : (
                        <Text>Select a school to view details</Text>
                    )}
                </Box>
            </Flex>

            <Box mt={4} flex="1">
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={defaultCenter}
                        zoom={5}
                        onLoad={handleMapLoad}
                    >
                        {schoolSearch.map((school) =>
                            school.LAT && school.LON ? (
                                <Marker
                                    key={school.NCESSCH}
                                    position={{ lat: school.LAT, lng: school.LON }}
                                    icon={{
                                        url: schoolIcon,
                                        //scaledSize: new google.maps.Size(40, 40),
                                    }}
                                    onClick={() => handleMarkerClick(school)}
                                />
                            ) : null
                        )}
                        {selectedMarker && selectedMarker.LAT && selectedMarker.LON && (
                            <InfoWindow
                                position={{ lat: selectedMarker.LAT, lng: selectedMarker.LON }}
                                onCloseClick={() => setSelectedMarker(null)}
                            >
                                <Box>
                                    <Heading size="sm">{selectedMarker.NAME}</Heading>
                                    <Text>City: {selectedMarker.CITY}</Text>
                                    <Text>State: {selectedMarker.STATE}</Text>
                                    <Text>ZIP: {selectedMarker.ZIP}</Text>
                                    <Text>Street: {selectedMarker.STREET}</Text>
                                    <Text>County: {selectedMarker.NMCNTY}</Text>
                                </Box>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                ) : (
                    <Spinner />
                )}
            </Box>
        </Flex>
    );
};

export default Home;
