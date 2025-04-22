import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1745289037492 implements MigrationInterface {
    name = 'InitialSchema1745289037492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("uid" character varying NOT NULL, "name" character varying, CONSTRAINT "PK_df955cae05f17b2bcf5045cc021" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`CREATE TABLE "item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "checked" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "list_id" uuid, "owner_uid" character varying, CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "list" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "shareToken" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "owner_uid" character varying, CONSTRAINT "UQ_4ed5f8324d02622cf1d00a8a813" UNIQUE ("shareToken"), CONSTRAINT "PK_d8feafd203525d5f9c37b3ed3b9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "list_participants_user" ("list_id" uuid NOT NULL, "user_uid" character varying NOT NULL, CONSTRAINT "PK_4771b101d04360ea2210d951059" PRIMARY KEY ("list_id", "user_uid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9f8a2f4aaabe51b2355b5e8600" ON "list_participants_user" ("list_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_9376a98637e096f00ca3b7e3f4" ON "list_participants_user" ("user_uid") `);
        await queryRunner.query(`ALTER TABLE "item" ADD CONSTRAINT "FK_e3cb6c22e692535555c28e501c5" FOREIGN KEY ("list_id") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item" ADD CONSTRAINT "FK_f4201d775c2ed5d52309bc535ff" FOREIGN KEY ("owner_uid") REFERENCES "user"("uid") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "list" ADD CONSTRAINT "FK_a3418b9a6b155418a8bcae2cc54" FOREIGN KEY ("owner_uid") REFERENCES "user"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "list_participants_user" ADD CONSTRAINT "FK_9f8a2f4aaabe51b2355b5e86006" FOREIGN KEY ("list_id") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "list_participants_user" ADD CONSTRAINT "FK_9376a98637e096f00ca3b7e3f49" FOREIGN KEY ("user_uid") REFERENCES "user"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list_participants_user" DROP CONSTRAINT "FK_9376a98637e096f00ca3b7e3f49"`);
        await queryRunner.query(`ALTER TABLE "list_participants_user" DROP CONSTRAINT "FK_9f8a2f4aaabe51b2355b5e86006"`);
        await queryRunner.query(`ALTER TABLE "list" DROP CONSTRAINT "FK_a3418b9a6b155418a8bcae2cc54"`);
        await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_f4201d775c2ed5d52309bc535ff"`);
        await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_e3cb6c22e692535555c28e501c5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9376a98637e096f00ca3b7e3f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9f8a2f4aaabe51b2355b5e8600"`);
        await queryRunner.query(`DROP TABLE "list_participants_user"`);
        await queryRunner.query(`DROP TABLE "list"`);
        await queryRunner.query(`DROP TABLE "item"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
