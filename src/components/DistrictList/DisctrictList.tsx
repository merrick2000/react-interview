import React from "react";
import { Box } from "@chakra-ui/react";
import { NCESDistrictFeatureAttributes } from "@utils/nces";

interface DistrictListProps {
    districts: NCESDistrictFeatureAttributes[];
    onDistrictSelect: (district: NCESDistrictFeatureAttributes) => void;
}

const DistrictList: React.FC<DistrictListProps> = ({ districts, onDistrictSelect }) => {
    return (
        <>
            {districts.map((district) => (
                <Box
                    key={district.LEAID}
                    p={4}
                    borderWidth={1}
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{ bg: "gray.100" }}
                    onClick={() => onDistrictSelect(district)}
                >
                    {district.NAME}
                </Box>
            ))}
        </>
    );
};

export default DistrictList;
