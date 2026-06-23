# Docker - AAP-OBDPrint

## Build
From this folder (`h:/Portfolio 2020/Apps/AAP-OBDPrint/AAP-OBDPrint`):

```bash
docker build -t aap-obdprint:latest .
```

## Run
Expose the app on port **5087**:

```bash
docker run --rm -p 5087:5087 -e ASPNETCORE_URLS=http://+:5087 aap-obdprint:latest
```

Then open:
- http://localhost:5087

## Notes
- The container uses **.NET 10** runtime images.
- `ASPNETCORE_ENVIRONMENT` defaults to `Production` in the Dockerfile.

