-- Airlink AI: lead validation, anti-abuse, review workflow and knowledge base.
-- Additive only: every new Lead column is nullable or has a default, so the
-- existing 263 production rows remain valid.
-- Apply with: npx prisma db execute --file prisma/sql/20261027_lead_pipeline.sql --schema prisma/schema.prisma

ALTER TABLE `Coverage` ADD COLUMN `pincodes` VARCHAR(191) NULL;

ALTER TABLE `Lead` ADD COLUMN `botRisk` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `botSignals` TEXT NULL,
    ADD COLUMN `campaign` VARCHAR(191) NULL,
    ADD COLUMN `classification` VARCHAR(191) NULL,
    ADD COLUMN `confidence` VARCHAR(191) NULL,
    ADD COLUMN `duplicateOfId` VARCHAR(191) NULL,
    ADD COLUMN `followUpOwner` VARCHAR(191) NULL,
    ADD COLUMN `ipHash` VARCHAR(191) NULL,
    ADD COLUMN `lastContactAt` DATETIME(3) NULL,
    ADD COLUMN `nameNormalized` VARCHAR(191) NULL,
    ADD COLUMN `phoneNormalized` VARCHAR(191) NULL,
    ADD COLUMN `qualityScore` INTEGER NULL,
    ADD COLUMN `rawName` VARCHAR(191) NULL,
    ADD COLUMN `rawPhone` VARCHAR(191) NULL,
    ADD COLUMN `reviewOutcome` VARCHAR(191) NULL,
    ADD COLUMN `reviewedAt` DATETIME(3) NULL,
    ADD COLUMN `reviewedBy` VARCHAR(191) NULL,
    ADD COLUMN `spamRisk` INTEGER NULL,
    ADD COLUMN `userAgentHash` VARCHAR(191) NULL,
    ADD COLUMN `validationFlags` TEXT NULL,
    ADD COLUMN `validationStatus` VARCHAR(191) NOT NULL DEFAULT 'valid',
    ADD COLUMN `verificationStatus` VARCHAR(191) NOT NULL DEFAULT 'unverified';

CREATE TABLE `LeadEvent` (
    `id` VARCHAR(191) NOT NULL,
    `leadId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `actor` VARCHAR(191) NULL,
    `payload` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LeadEvent_leadId_createdAt_idx`(`leadId`, `createdAt`),
    INDEX `LeadEvent_type_createdAt_idx`(`type`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `RateLimitBucket` (
    `key` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 0,
    `windowStart` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `RateLimitBucket_windowStart_idx`(`windowStart`),
    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SecurityEvent` (
    `id` VARCHAR(191) NOT NULL,
    `kind` VARCHAR(191) NOT NULL,
    `ipHash` VARCHAR(191) NULL,
    `detail` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SecurityEvent_kind_createdAt_idx`(`kind`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `KnowledgeEntry` (
    `id` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `answer` TEXT NOT NULL,
    `keywords` TEXT NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `KnowledgeEntry_category_idx`(`category`),
    INDEX `KnowledgeEntry_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `Lead_phoneNormalized_idx` ON `Lead`(`phoneNormalized`);
CREATE INDEX `Lead_validationStatus_idx` ON `Lead`(`validationStatus`);
CREATE INDEX `Lead_classification_idx` ON `Lead`(`classification`);
CREATE INDEX `Lead_duplicateOfId_idx` ON `Lead`(`duplicateOfId`);

ALTER TABLE `LeadEvent` ADD CONSTRAINT `LeadEvent_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
