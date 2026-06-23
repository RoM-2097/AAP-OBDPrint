# Build and run the app using a Linux container (Render-friendly)
# NOTE: Your app is .NET 10 and Blazor Server (.AddInteractiveServerComponents()).

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 5087
ENV ASPNETCORE_URLS=http://+:5087
ENV ASPNETCORE_ENVIRONMENT=Production

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG configuration=Release
WORKDIR /src

# Copy project source to the expected folder layout expected by the csproj.
# The previous approach only moved a subset of files and caused Razor namespace/layout types to be missing during container builds.
COPY . .

# Restore (uses only csproj in the copied tree)
RUN dotnet restore "AAP-OBDPrint.csproj"

RUN dotnet build "AAP-OBDPrint.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "AAP-OBDPrint.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AAP-OBDPrint.dll"]

