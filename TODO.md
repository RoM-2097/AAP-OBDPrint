# TODO

## Docker container build fix
- [ ] Fix Dockerfile to ensure full project source (including Components/) is copied into the build stage so Razor namespaces/layout compile.
- [ ] Re-run `docker build -t aap-obdprint:latest .` and confirm CS0234/CS0246 errors are gone.
- [ ] If build passes, run `docker run --rm -p 5087:5087 -e ASPNETCORE_URLS=http://+:5087 aap-obdprint:latest` and verify container starts.

