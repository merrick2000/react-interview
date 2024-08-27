import React, { useState, useEffect, useCallback } from "react";
import {
    Button,
    Center,
    Heading,
    Text,
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
    FormControl,
    FormLabel,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
} from "@chakra-ui/react";
import { Card } from '@components/design/Card';
import { searchSchoolDistricts, searchSchools, NCESDistrictFeatureAttributes, NCESSchoolFeatureAttributes } from "@utils/nces";

const Home: React.FC = () => {
    const [searching, setSearching] = useState(false);
    const [districtSearch, setDistrictSearch] = useState<NCESDistrictFeatureAttributes[]>([]);
    const [schoolSearch, setSchoolSearch] = useState<NCESSchoolFeatureAttributes[]>([]);
    const [districtQuery, setDistrictQuery] = useState("");
    const [schoolQuery, setSchoolQuery] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState<NCESDistrictFeatureAttributes | null>(null);
    const [selectedSchool, setSelectedSchool] = useState<NCESSchoolFeatureAttributes | null>(null);
    const [filteredDistricts, setFilteredDistricts] = useState<NCESDistrictFeatureAttributes[]>([]);
    const [filteredSchools, setFilteredSchools] = useState<NCESSchoolFeatureAttributes[]>([]);
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Function to search districts
    const handleDistrictSearch = useCallback(async () => {
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
    }, [districtQuery, toast]);

    // Function to search schools
    const handleSchoolSearch = useCallback(async () => {
        setSearching(true);
        try {
            const results = await searchSchools(schoolQuery, selectedDistrict?.LEAID || "");
            setSchoolSearch(results);
            setFilteredSchools(results);
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
    }, [schoolQuery, selectedDistrict, toast]);

    // Effect to search schools when a district is selected
    useEffect(() => {
        if (selectedDistrict) {
            handleSchoolSearch();
        }
    }, [selectedDistrict, handleSchoolSearch]);

    // Filter districts based on query
    useEffect(() => {
        if (districtSearch.length > 0) {
            const filtered = districtSearch.filter(district =>
                district.NAME.toLowerCase().includes(districtQuery.toLowerCase())
            );
            setFilteredDistricts(filtered);
        }
    }, [districtQuery, districtSearch]);

    // Filter schools based on query
    useEffect(() => {
        if (schoolSearch.length > 0) {
            const filtered = schoolSearch.filter(school =>
                school.NAME?.toLowerCase().includes(schoolQuery.toLowerCase())
            );
            setFilteredSchools(filtered);
        }
    }, [schoolQuery, schoolSearch]);

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

                    {/* Affichage des résultats */}
                    {searching ? <Spinner /> : (
                        <VStack spacing={4} align="start">
                            <Heading size="md">Districts</Heading>
                            <VStack spacing={4} align="start">
                                {filteredDistricts.map(district => (
                                    <Box
                                        key={district.LEAID}
                                        onClick={() => {
                                            setSelectedDistrict(district);
                                            setSelectedSchool(null); // Reset school selection
                                        }}
                                        cursor="pointer"
                                        _hover={{ bg: "gray.100" }}
                                        p={2}
                                        borderWidth={1}
                                        borderRadius="md"
                                    >
                                        {district.NAME}
                                    </Box>
                                ))}
                            </VStack>

                            {selectedDistrict && (
                                <>
                                    <Heading size="md">Schools</Heading>
                                    <FormControl>
                                        <FormLabel>Select a school</FormLabel>
                                        <Select
                                            placeholder="Select a school"
                                            onChange={(e) => {
                                                const school = filteredSchools.find(s => s.LEAID === e.target.value);
                                                setSelectedSchool(school || null);
                                            }}
                                        >
                                            {filteredSchools.map(school => (
                                                <option key={school.LEAID} value={school.LEAID}>
                                                    {school.NAME}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {selectedSchool && (
                                        <Box mt={4} p={4} borderWidth={1} borderRadius="md">
                                            <Heading size="sm">{selectedSchool.NAME}</Heading>
                                            <Text>Details about the selected school will be shown here.</Text>
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
