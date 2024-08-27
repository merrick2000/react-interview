import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import { NCESSchoolFeatureAttributes } from "@utils/nces";

interface SchoolDetailsProps {
    school: NCESSchoolFeatureAttributes;
}

const SchoolDetails: React.FC<SchoolDetailsProps> = ({ school }) => {
    return (
        <Box borderWidth={1} borderRadius="md" p={4} mt={4}>
            <Heading size="sm">School Details</Heading>
            <Text><strong>Name:</strong> {school.NAME}</Text>
            <Text><strong>Address:</strong> {school.STREET}, {school.CITY}, {school.STATE} {school.ZIP}</Text>
        </Box>
    );
};

export default SchoolDetails;
