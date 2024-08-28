import React from "react";
import { VStack, Input, Button, Select } from "@chakra-ui/react";
import { NCESSchoolFeatureAttributes } from "@utils/nces";

interface SchoolSearchProps {
    schoolQuery: string;
    onSchoolQueryChange: (value: string) => void;
    onSchoolSearch: () => void;
    schoolSearchResults: NCESSchoolFeatureAttributes[];
    onSchoolSelect: (school: NCESSchoolFeatureAttributes | null) => void;
    isDisabled: boolean;
    isLoading: boolean;
}

const SchoolSearch: React.FC<SchoolSearchProps> = ({
    schoolQuery,
    onSchoolQueryChange,
    onSchoolSearch,
    schoolSearchResults,
    onSchoolSelect,
    isDisabled,
    isLoading,
}) => (
    <VStack flex="1" spacing={4} visibility={!isDisabled ? "visible" : "hidden"}>
        <Input
            placeholder="Search for a school"
            value={schoolQuery}
            onChange={(e) => onSchoolQueryChange(e.target.value)}
            disabled={isDisabled}
        />
        <Button onClick={onSchoolSearch} isLoading={isLoading} disabled={isDisabled}>
            Search School
        </Button>

        <Select
            placeholder="Select a school"
            onChange={(e) => {
                const school = schoolSearchResults.find(s => s?.NCESSCH === e.target.value);
                onSchoolSelect(school || null);
            }}
            disabled={isDisabled}
        >
            {schoolSearchResults.map(school => (
                <option key={school?.NCESSCH} value={school?.NCESSCH}>
                    {school?.NAME}
                </option>
            ))}
        </Select>
    </VStack>
);

export default SchoolSearch;
