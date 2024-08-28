import React from "react";
import { VStack, Input, Button, Select } from "@chakra-ui/react";
import { NCESDistrictFeatureAttributes } from "@utils/nces";

interface DistrictSearchProps {
    districtQuery: string;
    onDistrictQueryChange: (value: string) => void;
    onDistrictSearch: () => void;
    filteredDistricts: NCESDistrictFeatureAttributes[];
    onDistrictSelect: (district: NCESDistrictFeatureAttributes | null) => void;
    isLoading: boolean;
}

const DistrictSearch: React.FC<DistrictSearchProps> = ({
    districtQuery,
    onDistrictQueryChange,
    onDistrictSearch,
    filteredDistricts,
    onDistrictSelect,
    isLoading,
}) => (
    <VStack flex="1" spacing={4}>
        <Input
            placeholder="Search for a district"
            value={districtQuery}
            onChange={(e) => onDistrictQueryChange(e.target.value)}
        />
        <Button onClick={onDistrictSearch} isLoading={isLoading}>
            Search District
        </Button>

        <Select
            placeholder="Select a district"
            onChange={(e) => {
                const district = filteredDistricts.find(d => d.LEAID === e.target.value);
                onDistrictSelect(district || null);
            }}
        >
            {filteredDistricts.map(district => (
                <option key={district.LEAID} value={district.LEAID}>
                    {district.NAME}
                </option>
            ))}
        </Select>
    </VStack>
);

export default DistrictSearch;
