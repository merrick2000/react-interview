import React, { useEffect } from "react"
import {
    Button,
    Center,
    Heading,
    Text,
    Icon,
    Input,
    ScaleFade,
    OrderedList,
    Divider,
    ListItem,
    Spinner,
    InputGroup, // Some Chakra components that might be usefull
    HStack,
    VStack,
    InputRightAddon,
} from "@chakra-ui/react"
import { Card } from '@components/design/Card'
import { searchSchoolDistricts, searchSchools, NCESDistrictFeatureAttributes, NCESSchoolFeatureAttributes } from "@utils/nces"


const Home: React.FC = () => {
    const [searching, setSearching] = React.useState(false)
    const [districtSearch, setDistrictSearch] = React.useState<NCESDistrictFeatureAttributes[]>([]);
    const [schoolSearch, setSchoolSearch] = React.useState<NCESSchoolFeatureAttributes[]>([]);
    const [districtQuery, setDistrictQuery] = React.useState("");
    const [schoolQuery, setSchoolQuery] = React.useState("");
    
    const demo = async () => { // see console for api result examples
        setSearching(true)
        const demoDistrictSearch = await searchSchoolDistricts("Peninsula School District")
        setDistrictSearch(demoDistrictSearch)
        console.log("District example", demoDistrictSearch)

        const demoSchoolSearch = await searchSchools("k", demoDistrictSearch[1].LEAID)
        setSchoolSearch(demoSchoolSearch)
        console.log("School Example", demoSchoolSearch)
        setSearching(false)
    }
    const handleDistrictSearch = async () => {
        setSearching(true);
        const results = await searchSchoolDistricts(districtQuery);
        setDistrictSearch(results);
        setSearching(false);
    };
    
    const handleSchoolSearch = async () => {
        setSearching(true);
        const results = await searchSchools(schoolQuery, districtSearch[0]?.LEAID);
        setSchoolSearch(results);
        setSearching(false);
    };

    useEffect(() => {
        demo()
    }, [])
    
    return (
        <Center padding="100px" height="90vh">
            <ScaleFade initialScale={0.9} in={true}>
                <Card variant="rounded" borderColor="blue">
                    <Heading>School Data Finder</Heading>
                    
                    {/* Recherche des districts */}
                    <VStack spacing={4}>
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
                        
                        {/* Recherche des écoles */}
                        <InputGroup>
                            <Input
                                placeholder="Search for a school"
                                value={schoolQuery}
                                onChange={(e) => setSchoolQuery(e.target.value)}
                                isDisabled={!districtSearch.length} // Désactiver si aucune recherche de district n'est effectuée
                            />
                            <InputRightAddon>
                                <Button onClick={handleSchoolSearch}>Search School</Button>
                            </InputRightAddon>
                        </InputGroup>
                    </VStack>
    
                    <Divider margin={4} />
                    
                    {/* Affichage des résultats */}
                    <Text>
                        {searching ? <Spinner /> : <></>}
                        <br />
                        {districtSearch.length} Districts found<br />
                        {schoolSearch.length} Schools found<br />
                    </Text>
                    
                    {/* Affichage des résultats */}
                    <VStack spacing={4} align="start">
                        <Heading size="md">Districts</Heading>
                        <OrderedList>
                            {districtSearch.map(district => (
                                <ListItem key={district.LEAID}>{district.NAME}</ListItem>
                            ))}
                        </OrderedList>
    
                        <Heading size="md">Schools</Heading>
                        <OrderedList>
                            {schoolSearch.map(school => (
                                <ListItem key={school.SCHOOLID}>{school.NAME}</ListItem>
                            ))}
                        </OrderedList>
                    </VStack>
                </Card>
            </ScaleFade>
        </Center>
    );
    
};

export default Home