CREATE TABLE `knowledge_base` (
	`id` int AUTO_INCREMENT NOT NULL,
	`astrolabeId` int NOT NULL,
	`palaceName` varchar(20) NOT NULL,
	`palaceIndex` int NOT NULL,
	`earthlyBranch` varchar(10),
	`heavenlyStem` varchar(10),
	`majorStars` text,
	`minorStars` text,
	`adjStars` text,
	`changSheng12` varchar(20),
	`boshi12` varchar(20),
	`jiangqian12` varchar(20),
	`suiqian12` varchar(20),
	`decadal` text,
	`ages` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `knowledge_base_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `qa_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`astrolabeId` int NOT NULL,
	`userId` int NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `qa_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `knowledge_base` ADD CONSTRAINT `knowledge_base_astrolabeId_astrolabes_id_fk` FOREIGN KEY (`astrolabeId`) REFERENCES `astrolabes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `qa_records` ADD CONSTRAINT `qa_records_astrolabeId_astrolabes_id_fk` FOREIGN KEY (`astrolabeId`) REFERENCES `astrolabes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `qa_records` ADD CONSTRAINT `qa_records_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;