import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import { NCESSchoolFeatureAttributes } from "@utils/nces";

interface SchoolDetailsProps {
    selectedSchool: NCESSchoolFeatureAttributes | null;
}

const SchoolDetails: React.FC<SchoolDetailsProps> = ({ selectedSchool }) => (
    <Box flex="1" borderWidth={1} borderRadius="md" p={4} visibility={selectedSchool ? "visible" : "hidden"}>
        {selectedSchool ? (
            <>
                <Heading size="md">{selectedSchool.NAME}</Heading>
                <Text>City: {selectedSchool.CITY}</Text>
                <Text>State: {selectedSchool.STATE}</Text>
                <Text>ZIP: {selectedSchool.ZIP}</Text>
                <Text>Street: {selectedSchool.STREET}</Text>
                <Text>County: {selectedSchool.NMCNTY}</Text>
            </>
        ) : (
            <Text>Select a school to view details</Text>
        )}
    </Box>
);

export default SchoolDetails;
