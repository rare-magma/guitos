FROM docker.io/library/node:lts-alpine as build
RUN npm install -g pnpm
WORKDIR /app
USER node
COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN pnpm install
COPY --chown=node:node index.html vite.config.ts tsconfig.json .postcssrc.json .npmrc ./
COPY --chown=node:node public ./public
COPY --chown=node:node src ./src
RUN pnpm build && \
    find ./build \
    -type f \
    -size +1500c \
    ! -name "*.gz" \
    ! -name "*.svg" \
    ! -name "index.html" \
    ! -name "robots.txt" \
    | while read file; do gzip "$file"; done

FROM docker.io/library/busybox:latest
RUN adduser -D static
USER static
WORKDIR /home/static
COPY --from=build --chown=static:static /app/build .
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=1s --start-period=5s --retries=3 CMD [ "wget", "--no-verbose", "--tries=1", "--spider", "127.0.0.1:3000" ]
CMD ["busybox", "httpd", "-f", "-p", "3000"]