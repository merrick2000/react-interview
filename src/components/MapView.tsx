import React from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { NCESSchoolFeatureAttributes } from "@utils/nces";
import schoolIcon from "../assets/school.svg";
import { Box, Heading, Text } from "@chakra-ui/react";

interface MapViewProps {
    schoolSearchResults: NCESSchoolFeatureAttributes[];
    selectedMarker: NCESSchoolFeatureAttributes | null;
    onMarkerClick: (school: NCESSchoolFeatureAttributes) => void;
    onMapLoad: (mapInstance: google.maps.Map) => void;
    onCloseClick: () => void;
}

const mapContainerStyle = {
    width: "100%",
    height: "400px",
};

const defaultCenter = {
    lat: 39.8283,
    lng: -98.5795,
};

const MapView: React.FC<MapViewProps> = ({
    schoolSearchResults,
    selectedMarker,
    onMarkerClick,
    onMapLoad,
    onCloseClick,
}) => (
    <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={5}
        onLoad={onMapLoad}
    >
        {schoolSearchResults.map((school) =>
            school.LAT && school.LON ? (
                <Marker
                    key={school.NCESSCH}
                    position={{ lat: school.LAT, lng: school.LON }}
                    icon={{
                        url: schoolIcon,
                        scaledSize: new google.maps.Size(40, 40),
                    }}
                    onClick={() => onMarkerClick(school)}
                />
            ) : null
        )}
        {selectedMarker && selectedMarker.LAT && selectedMarker.LON && (
            <InfoWindow
                position={{ lat: selectedMarker.LAT, lng: selectedMarker.LON }}
                onCloseClick={onCloseClick}
            >
                <Box>
                    <Heading size="sm">{selectedMarker.NAME}</Heading>
                    <Text>City: {selectedMarker.CITY}</Text>
                    <Text>State: {selectedMarker.STATE}</Text>
                    <Text>ZIP: {selectedMarker.ZIP}</Text>
                    <Text>Street: {selectedMarker.STREET}</Text>
                    <Text>County: {selectedMarker.NMCNTY}</Text>
                </Box>
            </InfoWindow>
        )}
    </GoogleMap>
);

export default MapView;
