# Build and run the app using a Linux container (Render-friendly)
# NOTE: Your app is .NET 10 and Blazor Server (.AddInteractiveServerComponents()).

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 5087
ENV ASPNETCORE_URLS=http://+:5087

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG configuration=Release
WORKDIR /src

# Copy csproj first for better layer caching
COPY ["AAP-OBDPrint.csproj", "AAP-OBDPrint/" ]
RUN dotnet restore "AAP-OBDPrint/AAP-OBDPrint.csproj"

# Copy the rest of the source
COPY . .
WORKDIR /src/AAP-OBDPrint
RUN dotnet build "AAP-OBDPrint.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "AAP-OBDPrint.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AAP-OBDPrint.dll"]

