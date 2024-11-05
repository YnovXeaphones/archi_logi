CREATE TABLE `Home` (
  `id` integer PRIMARY KEY,
  `ip` varchar(255),
  `last_ping` datetime,
  `port` integer
);

CREATE TABLE `Device` (
  `id` integer PRIMARY KEY,
  `home_id` integer,
  `reference` varchar(255)
);

ALTER TABLE `Device` ADD FOREIGN KEY (`home_id`) REFERENCES `Home` (`id`);
