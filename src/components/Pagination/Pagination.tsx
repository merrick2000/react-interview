import React from "react";
import { HStack, Button, Text } from "@chakra-ui/react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <HStack spacing={4} justify="center" mb={6}>
            <Button
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Previous
            </Button>
            <Text>{`Page ${currentPage} of ${totalPages}`}</Text>
            <Button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
            </Button>
        </HStack>
    );
};

export default Pagination;
