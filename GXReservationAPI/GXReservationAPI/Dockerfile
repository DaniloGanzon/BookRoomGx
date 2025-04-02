# Build stage
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Copy just the project file first (for efficient layer caching)
COPY ["BookRoomGx/GXReservationAPI/GXReservationAPI/GXReservationAPI.csproj", "GXReservationAPI/"]
RUN dotnet restore "GXReservationAPI/GXReservationAPI.csproj"

# Copy remaining source files
COPY ["BookRoomGx/GXReservationAPI/GXReservationAPI/", "GXReservationAPI/"]

WORKDIR "/src/GXReservationAPI"
RUN dotnet build "GXReservationAPI.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "GXReservationAPI.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GXReservationAPI.dll"]