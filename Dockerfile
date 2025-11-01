FROM --platform=$BUILDPLATFORM docker.io/library/golang:alpine AS builder
WORKDIR /app
ENV CGO_ENABLED=0

COPY go.mod go.mod
COPY internal internal
COPY cmd cmd

RUN for arch in amd64 arm64; do \
      GOOS=linux GOARCH=$arch go build -ldflags "-s -w" -trimpath -o app-$arch ./cmd/server; \
    done

FROM cgr.dev/chainguard/static:latest
ARG TARGETARCH
COPY --from=builder /app/app-${TARGETARCH} /usr/bin/app
ENTRYPOINT ["/usr/bin/app"]