import React, { useState, useEffect } from "react";
import {
    Button,
    Center,
    Heading,
    Text,
    Input,
    ScaleFade,
    Divider,
    Spinner,
    VStack,
    InputGroup,
    InputRightAddon,
    Box,
    Select,
    Flex,
    useToast,
} from "@chakra-ui/react";
import { Card } from '@components/design/Card';
import { searchSchoolDistricts, searchSchools, NCESDistrictFeatureAttributes, NCESSchoolFeatureAttributes } from "@utils/nces";

const PAGE_SIZE = 20;

const Home: React.FC = () => {
    const [searching, setSearching] = useState(false);
    const [districtSearch, setDistrictSearch] = useState<NCESDistrictFeatureAttributes[]>([]);
    const [filteredDistricts, setFilteredDistricts] = useState<NCESDistrictFeatureAttributes[]>([]);
    const [schoolSearch, setSchoolSearch] = useState<NCESSchoolFeatureAttributes[]>([]);
    const [districtQuery, setDistrictQuery] = useState("");
    const [schoolQuery, setSchoolQuery] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState<NCESDistrictFeatureAttributes | null>(null);
    const [selectedSchool, setSelectedSchool] = useState<NCESSchoolFeatureAttributes | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const toast = useToast();

    // Function to search districts
    const handleDistrictSearch = async () => {
        setSearching(true);
        try {
            const results = await searchSchoolDistricts(districtQuery);
            setDistrictSearch(results);
            setTotalPages(Math.ceil(results.length / PAGE_SIZE));
            setFilteredDistricts(results.slice(0, PAGE_SIZE));
            setCurrentPage(1); // Reset to first page after new search
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

    // Function to search schools within the selected district
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

    // Update filtered districts when district search results or page changes
    useEffect(() => {
        if (districtSearch.length > 0) {
            setFilteredDistricts(districtSearch.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE));
        }
    }, [currentPage, districtSearch]);

    // Effect to automatically search for schools when a district is selected
    useEffect(() => {
        if (selectedDistrict) {
            handleSchoolSearch();
        }
    }, [selectedDistrict]);

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            height="100vh"
            padding={4}
            bg="gray.50"
        >
            <ScaleFade initialScale={0.9} in={true}>
                <Card variant="rounded" borderColor="blue" p={6} maxWidth="800px" width="100%">
                    <Heading mb={6}>School Data Finder</Heading>

                    {/* Search Districts */}
                    <VStack spacing={4} mb={6} width="100%">
                        <InputGroup>
                            <Input
                                placeholder="Search for a district"
                                value={districtQuery}
                                onChange={(e) => setDistrictQuery(e.target.value)}
                            />
                            <InputRightAddon>
                                <Button onClick={handleDistrictSearch}>Search District</Button>
                            </InputRightAddon>
                        </InputGroup>
                    </VStack>

                    {/* Filtered Districts List */}
                    {filteredDistricts.length > 0 && (
                        <VStack spacing={4} mb={6} width="100%">
                            <Select
                                placeholder="Select a district"
                                onChange={(e) => {
                                    const selectedLEAID = e.target.value;
                                    const district = districtSearch.find(d => d.LEAID === selectedLEAID);
                                    setSelectedDistrict(district || null);
                                    setSelectedSchool(null); // Reset school selection
                                    setSchoolSearch([]); // Reset school results
                                    setSchoolQuery("");  // Reset school query
                                }}
                            >
                                {filteredDistricts.map(district => (
                                    <option key={district.LEAID} value={district.LEAID}>
                                        {district.NAME}
                                    </option>
                                ))}
                            </Select>

                            {selectedDistrict && (
                                <InputGroup>
                                    <Input
                                        placeholder="Search for a school"
                                        value={schoolQuery}
                                        onChange={(e) => setSchoolQuery(e.target.value)}
                                    />
                                    <InputRightAddon>
                                        <Button onClick={handleSchoolSearch}>Search School</Button>
                                    </InputRightAddon>
                                </InputGroup>
                            )}
                        </VStack>
                    )}

                    <Divider margin={4} />

                    {/* Display Results */}
                    {searching ? <Spinner /> : (
                        <VStack spacing={4} align="start" width="100%">
                            <Heading size="md">Districts</Heading>
                            <VStack spacing={2} align="start" width="100%">
                                {filteredDistricts.map(district => (
                                    <Box
                                        key={district.LEAID}
                                        p={4}
                                        borderWidth={1}
                                        borderRadius="md"
                                        cursor="pointer"
                                        _hover={{ bg: "gray.100" }}
                                        onClick={() => {
                                            setSelectedDistrict(district);
                                            setSchoolSearch([]);
                                            setSchoolQuery("");
                                            setSelectedSchool(null); // Reset school selection
                                        }}
                                        width="100%"
                                    >
                                        {district.NAME}
                                    </Box>
                                ))}
                            </VStack>

                            {/* Pagination Controls */}
                            <Flex justify="space-between" width="100%" mt={4}>
                                <Button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    isDisabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <Text>Page {currentPage} of {totalPages}</Text>
                                <Button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    isDisabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </Flex>

                            {selectedDistrict && schoolSearch.length > 0 && (
                                <>
                                    <Heading size="md" mt={6}>Schools in {selectedDistrict.NAME}</Heading>
                                    <VStack spacing={2} align="start" width="100%">
                                        {schoolSearch.map(school => (
                                            <Box
                                                key={school.NCESSCH}
                                                p={4}
                                                borderWidth={1}
                                                borderRadius="md"
                                                cursor="pointer"
                                                _hover={{ bg: "gray.100" }}
                                                onClick={() => setSelectedSchool(school)}
                                                width="100%"
                                            >
                                                {school.NAME}
                                            </Box>
                                        ))}
                                    </VStack>
                                </>
                            )}

                            {/* Display selected school details */}
                            {selectedSchool && (
                                <Box mt={6} p={4} borderWidth={1} borderRadius="md" width="100%">
                                    <Heading size="md">School Details</Heading>
                                    <Text><strong>Name:</strong> {selectedSchool.NAME}</Text>
                                    <Text><strong>Address:</strong> {selectedSchool.STREET}, {selectedSchool.CITY}, {selectedSchool.STATE} {selectedSchool.ZIP}</Text>
                                    <Text><strong>County:</strong> {selectedSchool.NMCNTY}</Text>
                                    <Text><strong>Locale:</strong> {selectedSchool.LOCALE}</Text>
                                    <Text><strong>Latitude:</strong> {selectedSchool.LAT}</Text>
                                    <Text><strong>Longitude:</strong> {selectedSchool.LON}</Text>
                                </Box>
                            )}
                        </VStack>
                    )}
                </Card>
            </ScaleFade>
        </Flex>
    );
};

export default Home;
