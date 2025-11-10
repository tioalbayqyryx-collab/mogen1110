CREATE TABLE `astrolabes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`name` varchar(100),
	`birthday` varchar(20) NOT NULL,
	`birthTime` int NOT NULL,
	`birthdayType` varchar(10) NOT NULL,
	`gender` varchar(10) NOT NULL,
	`astroData` text NOT NULL,
	`aiInterpretation` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `astrolabes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `astrolabes` ADD CONSTRAINT `astrolabes_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;