FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 5001

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["OAuthAPI.csproj", "./"]
RUN dotnet restore "OAuthAPI.csproj"
COPY . .
WORKDIR "/src/"

# Install dotnet-ef tool
RUN dotnet tool install --global dotnet-ef --version 8.0.0

# Run migrations
RUN /root/.dotnet/tools/dotnet-ef migrations add PublishMigration
RUN /root/.dotnet/tools/dotnet-ef database update PublishMigration

RUN dotnet build "OAuthAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "OAuthAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
RUN mkdir -p /app/Data
RUN chown -R $APP_UID /app/Data
RUN chmod -R 770 /app/Data

ENTRYPOINT ["dotnet", "OAuthAPI.dll"]
