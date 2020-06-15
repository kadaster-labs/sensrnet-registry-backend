#!/bin/bash

NUM_SENSORS=10
TIMEOUT=1

for (( c=1; c<=$NUM_SENSORS; c++ ))
do
	longitude=$((3+RANDOM%(7-3))).$((RANDOM%999))
	latitude=$((51+RANDOM%(54-51))).$((RANDOM%999))

	curl -X POST "http://localhost:3000/Sensor" -H "accept: */*" -H "Content-Type: application/json" -d "{\"name\":\"string\",\"location\":{\"longitude\":$latitude,\"latitude\":$longitude,\"height\":0,\"baseObjectId\":\"string\"},\"dataStreams\":[{\"name\":\"string\",\"reason\":\"string\",\"description\":\"string\",\"observedProperty\":\"string\",\"unitOfMeasurement\":\"string\",\"isPublic\":true,\"isOpenData\":true,\"isReusable\":true,\"documentationUrl\":\"string.com\",\"dataFrequency\":0,\"dataQuality\":0}],\"aim\":\"string\",\"description\":\"string\",\"manufacturer\":\"string\",\"active\":true,\"observationArea\":{},\"documentationUrl\":\"string.com\",\"theme\":[\"Weather\"],\"typeName\":\"string\",\"typeDetails\":{}}"
	echo "Sensor ${c}added"

	sleep $TIMEOUT
done

