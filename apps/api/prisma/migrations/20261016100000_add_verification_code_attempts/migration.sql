-- Add attempt counter for verification codes
ALTER TABLE `VerificationCode`
ADD COLUMN `attempts` INT NOT NULL DEFAULT 0;
