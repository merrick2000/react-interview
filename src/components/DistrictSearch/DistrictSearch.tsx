import React from "react";
import { Button, Input, InputGroup, InputRightAddon, FormControl, FormLabel } from "@chakra-ui/react";

interface DistrictSearchProps {
    districtQuery: string;
    setDistrictQuery: React.Dispatch<React.SetStateAction<string>>;
    handleDistrictSearch: () => void;
}

const DistrictSearch: React.FC<DistrictSearchProps> = ({ districtQuery, setDistrictQuery, handleDistrictSearch }) => {
    return (
        <FormControl>
            <FormLabel>Search for a district</FormLabel>
            <InputGroup>
                <Input
                    placeholder="Enter district name"
                    value={districtQuery}
                    onChange={(e) => setDistrictQuery(e.target.value)}
                />
                <InputRightAddon>
                    <Button onClick={handleDistrictSearch}>Search</Button>
                </InputRightAddon>
            </InputGroup>
        </FormControl>
    );
};

export default DistrictSearch;
