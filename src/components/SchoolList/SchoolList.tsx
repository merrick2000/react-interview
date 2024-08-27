import React from "react";
import { Box } from "@chakra-ui/react";
import { NCESSchoolFeatureAttributes } from "@utils/nces";

interface SchoolListProps {
    schools: NCESSchoolFeatureAttributes[];
    onSchoolSelect: (school: NCESSchoolFeatureAttributes) => void;
}

const SchoolList: React.FC<SchoolListProps> = ({ schools, onSchoolSelect }) => {
    return (
        <>
            {schools.map((school) => (
                <Box
                    key={school.NCESSCH}
                    p={4}
                    borderWidth={1}
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{ bg: "gray.100" }}
                    onClick={() => onSchoolSelect(school)}
                >
                    {school.NAME}
                </Box>
            ))}
        </>
    );
};

export default SchoolList;
