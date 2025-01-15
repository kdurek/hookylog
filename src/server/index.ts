import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { notificationJob } from "@/server/cron/notification";
import { CronJob } from "cron";

const port = parseInt(process.env.PORT ?? "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

void app.prepare().then(async () => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    void handle(req, res, parsedUrl);
  }).listen(port);

  CronJob.from(notificationJob);

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`,
  );
});
