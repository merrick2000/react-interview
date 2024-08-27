import React from "react";
import { Button, Input, InputGroup, InputRightAddon, FormControl, FormLabel } from "@chakra-ui/react";

interface SchoolSearchProps {
    schoolQuery: string;
    setSchoolQuery: React.Dispatch<React.SetStateAction<string>>;
    handleSchoolSearch: () => void;
}

const SchoolSearch: React.FC<SchoolSearchProps> = ({ schoolQuery, setSchoolQuery, handleSchoolSearch }) => {
    return (
        <FormControl>
            <FormLabel>Search for a school</FormLabel>
            <InputGroup>
                <Input
                    placeholder="Enter school name"
                    value={schoolQuery}
                    onChange={(e) => setSchoolQuery(e.target.value)}
                />
                <InputRightAddon>
                    <Button onClick={handleSchoolSearch}>Search</Button>
                </InputRightAddon>
            </InputGroup>
        </FormControl>
    );
};

export default SchoolSearch;
