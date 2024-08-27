import React, { useState, useEffect } from "react";
import {
    Button,
    Center,
    Heading,
    Input,
    ScaleFade,
    Divider,
    Spinner,
    InputGroup,
    VStack,
    InputRightAddon,
    Box,
    Select,
    useToast,
    HStack,
    Text,
    FormControl,
    FormLabel,
    OrderedList,
    ListItem,
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
            setFilteredDistricts(results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE));
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

    // Effect to handle pagination
    useEffect(() => {
        if (districtSearch.length > 0) {
            setFilteredDistricts(districtSearch.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE));
        }
    }, [currentPage, districtSearch]);

    // Function to search schools
    const handleSchoolSearch = async () => {
        setSearching(true);
        try {
            const results = await searchSchools(schoolQuery, selectedDistrict?.LEAID || "");
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

    // Effect to search schools when a district is selected
    useEffect(() => {
        if (selectedDistrict) {
            handleSchoolSearch();
        }
    }, [selectedDistrict]);

    return (
        <Center padding="100px" height="90vh">
            <ScaleFade initialScale={0.9} in={true}>
                <Card variant="rounded" borderColor="blue">
                    <Heading>School Data Finder</Heading>

                    {/* Recherche des districts */}
                    <VStack spacing={4} mb={6}>
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

                    {/* Liste des districts filtrés */}
                    {filteredDistricts.length > 0 && (
                        <VStack spacing={4} mb={6}>
                            <FormControl>
                                <FormLabel>Select a district</FormLabel>
                                <Select
                                    placeholder="Select a district"
                                    onChange={(e) => {
                                        const district = filteredDistricts.find(d => d.LEAID === e.target.value);
                                        setSelectedDistrict(district || null);
                                        setSelectedSchool(null); // Reset school selection
                                    }}
                                >
                                    {filteredDistricts.map(district => (
                                        <option key={district.LEAID} value={district.LEAID}>
                                            {district.NAME}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

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

                    {/* Pagination */}
                    {districtSearch.length > PAGE_SIZE && (
                        <HStack spacing={4} justify="center">
                            <Button
                                disabled={currentPage <= 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Previous
                            </Button>
                            <Text>{`Page ${currentPage} of ${totalPages}`}</Text>
                            <Button
                                disabled={currentPage >= totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </Button>
                        </HStack>
                    )}

                    {/* Affichage des résultats */}
                    {searching ? <Spinner /> : (
                        <VStack spacing={4} align="start">
                            <Heading size="md">Districts</Heading>
                            <OrderedList>
                                {filteredDistricts.map(district => (
                                    <ListItem
                                        key={district.LEAID}
                                        onClick={() => setSelectedDistrict(district)}
                                        cursor="pointer"
                                    >
                                        {district.NAME}
                                    </ListItem>
                                ))}
                            </OrderedList>

                            {selectedDistrict && (
                                <>
                                    <Heading size="md">Schools</Heading>
                                    <OrderedList>
                                        {schoolSearch.map(school => (
                                            <ListItem
                                                key={school.NCESSCH}
                                                onClick={() => setSelectedSchool(school)}
                                                cursor="pointer"
                                            >
                                                {school.NAME}
                                            </ListItem>
                                        ))}
                                    </OrderedList>
                                    {selectedSchool && (
                                        <Box borderWidth={1} borderRadius="md" p={4}>
                                            <Heading size="sm">School Details</Heading>
                                            <Text><strong>Name:</strong> {selectedSchool.NAME}</Text>
                                            <Text><strong>Address:</strong> {selectedSchool.STREET}, {selectedSchool.CITY}, {selectedSchool.STATE} {selectedSchool.ZIP}</Text>
                                        </Box>
                                    )}
                                </>
                            )}
                        </VStack>
                    )}
                </Card>
            </ScaleFade>
        </Center>
    );
};

export default Home;
