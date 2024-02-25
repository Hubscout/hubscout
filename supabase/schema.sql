
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE SCHEMA IF NOT EXISTS "supabase_migrations";

ALTER SCHEMA "supabase_migrations" OWNER TO "postgres";

CREATE SCHEMA IF NOT EXISTS "vecs";

ALTER SCHEMA "vecs" OWNER TO "postgres";

CREATE SCHEMA IF NOT EXISTS "vector";

ALTER SCHEMA "vector" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "public";

CREATE OR REPLACE FUNCTION "public"."generate_ulid"() RETURNS "uuid"
    LANGUAGE "sql" STRICT PARALLEL SAFE
    RETURN (("lpad"("to_hex"(("floor"((EXTRACT(epoch FROM "clock_timestamp"()) * (1000)::numeric)))::bigint), 12, '0'::"text") || "encode"("extensions"."gen_random_bytes"(10), 'hex'::"text")))::"uuid";

ALTER FUNCTION "public"."generate_ulid"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."casts" (
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    "deleted_at" timestamp with time zone,
    "fid" bigint NOT NULL,
    "parent_fid" bigint,
    "parent_url" "text",
    "text" "text" NOT NULL,
    "embeds" "json" DEFAULT '[]'::"json" NOT NULL,
    "mentions" "json" DEFAULT '[]'::"json" NOT NULL,
    "mentions_positions" "json" DEFAULT '[]'::"json" NOT NULL,
    "hash" "text" NOT NULL,
    "root_parent_hash" "text",
    "parent_hash" "text"
);

ALTER TABLE "public"."casts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."casts_embeddings" (
    "id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "embedding" "public"."vector"(1536) NOT NULL,
    "metadata" "jsonb"
);

ALTER TABLE "public"."casts_embeddings" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."chain_events" (
    "id" "uuid" DEFAULT "public"."generate_ulid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "block_timestamp" timestamp with time zone NOT NULL,
    "fid" bigint NOT NULL,
    "chain_id" bigint NOT NULL,
    "block_number" bigint NOT NULL,
    "transaction_index" smallint NOT NULL,
    "log_index" smallint NOT NULL,
    "type" smallint NOT NULL,
    "block_hash" "bytea" NOT NULL,
    "transaction_hash" "bytea" NOT NULL,
    "body" "json" NOT NULL,
    "raw" "bytea" NOT NULL
);

ALTER TABLE "public"."chain_events" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."fids" (
    "fid" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "registered_at" timestamp with time zone NOT NULL,
    "chain_event_id" "uuid" NOT NULL,
    "custody_address" "bytea" NOT NULL,
    "recovery_address" "bytea" NOT NULL
);

ALTER TABLE "public"."fids" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."fnames" (
    "id" "uuid" DEFAULT "public"."generate_ulid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "registered_at" timestamp with time zone NOT NULL,
    "deleted_at" timestamp with time zone,
    "fid" bigint NOT NULL,
    "type" smallint NOT NULL,
    "username" "text" NOT NULL,
    "display_name" "text",
    "bio" "text",
    "pfp" "text",
    "embedding" "public"."vector"(1536)
);

ALTER TABLE "public"."fnames" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."image_embeddings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "embedding" "public"."vector"(512) NOT NULL,
    "metadata" "jsonb"
);

ALTER TABLE "public"."image_embeddings" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."kysely_migration" (
    "name" character varying(255) NOT NULL,
    "timestamp" character varying(255) NOT NULL
);

ALTER TABLE "public"."kysely_migration" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."kysely_migration_lock" (
    "id" character varying(255) NOT NULL,
    "is_locked" integer DEFAULT 0 NOT NULL
);

ALTER TABLE "public"."kysely_migration_lock" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."links" (
    "id" "uuid" DEFAULT "public"."generate_ulid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    "deleted_at" timestamp with time zone,
    "fid" bigint NOT NULL,
    "target_fid" bigint NOT NULL,
    "display_timestamp" timestamp with time zone,
    "type" "text" NOT NULL,
    "hash" "bytea" NOT NULL
);

ALTER TABLE "public"."links" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "public"."generate_ulid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    "deleted_at" timestamp with time zone,
    "pruned_at" timestamp with time zone,
    "revoked_at" timestamp with time zone,
    "fid" bigint NOT NULL,
    "type" smallint NOT NULL,
    "hash_scheme" smallint NOT NULL,
    "signature_scheme" smallint NOT NULL,
    "hash" "bytea" NOT NULL,
    "signature" "bytea" NOT NULL,
    "signer" "bytea" NOT NULL,
    "body" "json" NOT NULL,
    "raw" "bytea" NOT NULL
);

ALTER TABLE "public"."messages" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."queries" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "query" "text" NOT NULL,
    "embedding" "public"."vector"(1536) NOT NULL
);

ALTER TABLE "public"."queries" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."reactions" (
    "id" "uuid" DEFAULT "public"."generate_ulid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "timestamp" timestamp with time zone,
    "deleted_at" timestamp with time zone,
    "fid" bigint NOT NULL,
    "target_cast_fid" bigint,
    "type" smallint NOT NULL,
    "target_url" "text",
    "hash" "text",
    "target_cast_hash" "text",
    "username" "text"
);

ALTER TABLE "public"."reactions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."signers" (
    "id" "uuid" DEFAULT "public"."generate_ulid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "added_at" timestamp with time zone NOT NULL,
    "removed_at" timestamp with time zone,
    "fid" bigint NOT NULL,
    "requester_fid" bigint NOT NULL,
    "add_chain_event_id" "uuid" NOT NULL,
    "remove_chain_event_id" "uuid",
    "key_type" smallint NOT NULL,
    "metadata_type" smallint NOT NULL,
    "key" "bytea" NOT NULL,
    "metadata" "json" NOT NULL
);

ALTER TABLE "public"."signers" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."storage_allocations" (
    "id" "uuid" DEFAULT "public"."generate_ulid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "rented_at" timestamp with time zone NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "chain_event_id" "uuid" NOT NULL,
    "fid" bigint NOT NULL,
    "units" smallint NOT NULL,
    "payer" "bytea" NOT NULL
);

ALTER TABLE "public"."storage_allocations" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_data" (
    "id" "uuid" DEFAULT "public"."generate_ulid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    "deleted_at" timestamp with time zone,
    "fid" bigint NOT NULL,
    "type" smallint NOT NULL,
    "hash" "bytea" NOT NULL,
    "value" "text" NOT NULL
);

ALTER TABLE "public"."user_data" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."username_proofs" (
    "id" "uuid" DEFAULT "public"."generate_ulid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    "deleted_at" timestamp with time zone,
    "fid" bigint NOT NULL,
    "type" smallint NOT NULL,
    "username" "text" NOT NULL,
    "signature" "bytea" NOT NULL,
    "owner" "bytea" NOT NULL
);

ALTER TABLE "public"."username_proofs" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."verifications" (
    "id" "uuid" DEFAULT "public"."generate_ulid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    "deleted_at" timestamp with time zone,
    "fid" bigint NOT NULL,
    "hash" "bytea" NOT NULL,
    "signer_address" "bytea" NOT NULL,
    "block_hash" "bytea" NOT NULL,
    "signature" "bytea" NOT NULL
);

ALTER TABLE "public"."verifications" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "supabase_migrations"."schema_migrations" (
    "version" "text" NOT NULL,
    "statements" "text"[],
    "name" "text"
);

ALTER TABLE "supabase_migrations"."schema_migrations" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "vecs"."cast_image_vectors" (
    "id" character varying NOT NULL,
    "vec" "public"."vector"(512) NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL
);

ALTER TABLE "vecs"."cast_image_vectors" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "vecs"."cast_vectors" (
    "id" character varying NOT NULL,
    "vec" "public"."vector"(1536) NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL
);

ALTER TABLE "vecs"."cast_vectors" OWNER TO "postgres";

ALTER TABLE ONLY "public"."casts_embeddings"
    ADD CONSTRAINT "casts_embeddings_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."casts"
    ADD CONSTRAINT "casts_pkey" PRIMARY KEY ("hash");

ALTER TABLE ONLY "public"."chain_events"
    ADD CONSTRAINT "chain_events_block_number_log_index_unique" UNIQUE ("block_number", "log_index");

ALTER TABLE ONLY "public"."chain_events"
    ADD CONSTRAINT "chain_events_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."fids"
    ADD CONSTRAINT "fids_pkey" PRIMARY KEY ("fid");

ALTER TABLE ONLY "public"."fnames"
    ADD CONSTRAINT "fnames_fid_unique" UNIQUE ("fid");

ALTER TABLE ONLY "public"."fnames"
    ADD CONSTRAINT "fnames_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."fnames"
    ADD CONSTRAINT "fnames_username_unique" UNIQUE ("username");

ALTER TABLE ONLY "public"."image_embeddings"
    ADD CONSTRAINT "image_embeddings_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."kysely_migration_lock"
    ADD CONSTRAINT "kysely_migration_lock_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."kysely_migration"
    ADD CONSTRAINT "kysely_migration_pkey" PRIMARY KEY ("name");

ALTER TABLE ONLY "public"."links"
    ADD CONSTRAINT "links_hash_unique" UNIQUE ("hash");

ALTER TABLE ONLY "public"."links"
    ADD CONSTRAINT "links_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_hash_unique" UNIQUE ("hash");

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."queries"
    ADD CONSTRAINT "queries_pkey" PRIMARY KEY ("query");

ALTER TABLE ONLY "public"."reactions"
    ADD CONSTRAINT "reactions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."signers"
    ADD CONSTRAINT "signers_fid_key_unique" UNIQUE ("fid", "key");

ALTER TABLE ONLY "public"."signers"
    ADD CONSTRAINT "signers_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."storage_allocations"
    ADD CONSTRAINT "storage_allocations_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."storage_allocations"
    ADD CONSTRAINT "storage_chain_event_id_fid_unique" UNIQUE ("chain_event_id", "fid");

ALTER TABLE ONLY "public"."user_data"
    ADD CONSTRAINT "user_data_fid_type_unique" UNIQUE ("fid", "type");

ALTER TABLE ONLY "public"."user_data"
    ADD CONSTRAINT "user_data_hash_unique" UNIQUE ("hash");

ALTER TABLE ONLY "public"."user_data"
    ADD CONSTRAINT "user_data_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."username_proofs"
    ADD CONSTRAINT "username_proofs_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."username_proofs"
    ADD CONSTRAINT "username_proofs_username_timestamp_unique" UNIQUE ("username", "timestamp");

ALTER TABLE ONLY "public"."verifications"
    ADD CONSTRAINT "verifications_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."verifications"
    ADD CONSTRAINT "verifications_signer_address_fid_unique" UNIQUE ("signer_address", "fid");

ALTER TABLE ONLY "supabase_migrations"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");

ALTER TABLE ONLY "vecs"."cast_image_vectors"
    ADD CONSTRAINT "cast_image_vectors_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "vecs"."cast_vectors"
    ADD CONSTRAINT "cast_vectors_pkey" PRIMARY KEY ("id");

CREATE INDEX "casts_active_fid_timestamp_index" ON "public"."casts" USING "btree" ("fid", "timestamp") WHERE ("deleted_at" IS NULL);

CREATE INDEX "casts_embeddings_embedding_idx" ON "public"."casts_embeddings" USING "hnsw" ("embedding" "public"."vector_cosine_ops");

CREATE INDEX "casts_parent_url_index" ON "public"."casts" USING "btree" ("parent_url") WHERE ("parent_url" IS NOT NULL);

CREATE INDEX "casts_timestamp_index" ON "public"."casts" USING "btree" ("timestamp");

CREATE INDEX "chain_events_block_hash_index" ON "public"."chain_events" USING "hash" ("block_hash");

CREATE INDEX "chain_events_block_timestamp_index" ON "public"."chain_events" USING "btree" ("block_timestamp");

CREATE INDEX "chain_events_fid_index" ON "public"."chain_events" USING "btree" ("fid");

CREATE INDEX "chain_events_transaction_hash_index" ON "public"."chain_events" USING "hash" ("transaction_hash");

CREATE INDEX "image_embeddings_embedding_idx" ON "public"."image_embeddings" USING "hnsw" ("embedding" "public"."vector_cosine_ops");

CREATE UNIQUE INDEX "links_fid_target_fid_type_unique" ON "public"."links" USING "btree" ("fid", "target_fid", "type") NULLS NOT DISTINCT;

CREATE INDEX "messages_fid_index" ON "public"."messages" USING "btree" ("fid");

CREATE INDEX "messages_signer_index" ON "public"."messages" USING "btree" ("signer");

CREATE INDEX "messages_timestamp_index" ON "public"."messages" USING "btree" ("timestamp");

CREATE INDEX "reactions_active_fid_timestamp_index" ON "public"."reactions" USING "btree" ("fid", "timestamp") WHERE ("deleted_at" IS NULL);

CREATE INDEX "reactions_target_url_index" ON "public"."reactions" USING "btree" ("target_url") WHERE ("target_url" IS NOT NULL);

CREATE INDEX "signers_fid_index" ON "public"."signers" USING "btree" ("fid");

CREATE INDEX "signers_requester_fid_index" ON "public"."signers" USING "btree" ("requester_fid");

CREATE INDEX "storage_allocations_fid_expires_at_index" ON "public"."storage_allocations" USING "btree" ("fid", "expires_at");

CREATE INDEX "verifications_fid_timestamp_index" ON "public"."verifications" USING "btree" ("fid", "timestamp");

CREATE INDEX "ix_vector_cosine_ops_hnsw_m16_efc64_7abe411" ON "vecs"."cast_vectors" USING "hnsw" ("vec" "public"."vector_cosine_ops") WITH ("m"='16', "ef_construction"='64');

ALTER TABLE ONLY "public"."fids"
    ADD CONSTRAINT "fids_chain_event_id_foreign" FOREIGN KEY ("chain_event_id") REFERENCES "public"."chain_events"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."storage_allocations"
    ADD CONSTRAINT "fids_chain_event_id_foreign" FOREIGN KEY ("chain_event_id") REFERENCES "public"."chain_events"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."fnames"
    ADD CONSTRAINT "fnames_fid_foreign" FOREIGN KEY ("fid") REFERENCES "public"."fids"("fid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."links"
    ADD CONSTRAINT "links_fid_foreign" FOREIGN KEY ("fid") REFERENCES "public"."fids"("fid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."links"
    ADD CONSTRAINT "links_target_fid_foreign" FOREIGN KEY ("target_fid") REFERENCES "public"."fids"("fid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_fid_foreign" FOREIGN KEY ("fid") REFERENCES "public"."fids"("fid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_signer_fid_foreign" FOREIGN KEY ("fid", "signer") REFERENCES "public"."signers"("fid", "key") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."signers"
    ADD CONSTRAINT "signers_add_chain_event_id_foreign" FOREIGN KEY ("add_chain_event_id") REFERENCES "public"."chain_events"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."signers"
    ADD CONSTRAINT "signers_fid_foreign" FOREIGN KEY ("fid") REFERENCES "public"."fids"("fid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."signers"
    ADD CONSTRAINT "signers_remove_chain_event_id_foreign" FOREIGN KEY ("remove_chain_event_id") REFERENCES "public"."chain_events"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."signers"
    ADD CONSTRAINT "signers_requester_fid_foreign" FOREIGN KEY ("requester_fid") REFERENCES "public"."fids"("fid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_data"
    ADD CONSTRAINT "user_data_fid_foreign" FOREIGN KEY ("fid") REFERENCES "public"."fids"("fid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_data"
    ADD CONSTRAINT "user_data_hash_foreign" FOREIGN KEY ("hash") REFERENCES "public"."messages"("hash") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."username_proofs"
    ADD CONSTRAINT "username_proofs_fid_foreign" FOREIGN KEY ("fid") REFERENCES "public"."fids"("fid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."verifications"
    ADD CONSTRAINT "verifications_fid_foreign" FOREIGN KEY ("fid") REFERENCES "public"."fids"("fid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."verifications"
    ADD CONSTRAINT "verifications_hash_foreign" FOREIGN KEY ("hash") REFERENCES "public"."messages"("hash") ON DELETE CASCADE;

ALTER TABLE "public"."queries" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."generate_ulid"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_ulid"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_ulid"() TO "service_role";

GRANT ALL ON FUNCTION "public"."hnswhandler"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."hnswhandler"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."hnswhandler"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hnswhandler"("internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "service_role";

GRANT ALL ON FUNCTION "public"."l1_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_mul"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_mul"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_mul"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_mul"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "service_role";

GRANT ALL ON FUNCTION "public"."sum"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."sum"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."sum"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sum"("public"."vector") TO "service_role";

GRANT ALL ON TABLE "public"."casts" TO "anon";
GRANT ALL ON TABLE "public"."casts" TO "authenticated";
GRANT ALL ON TABLE "public"."casts" TO "service_role";

GRANT ALL ON TABLE "public"."casts_embeddings" TO "anon";
GRANT ALL ON TABLE "public"."casts_embeddings" TO "authenticated";
GRANT ALL ON TABLE "public"."casts_embeddings" TO "service_role";

GRANT ALL ON TABLE "public"."chain_events" TO "anon";
GRANT ALL ON TABLE "public"."chain_events" TO "authenticated";
GRANT ALL ON TABLE "public"."chain_events" TO "service_role";

GRANT ALL ON TABLE "public"."fids" TO "anon";
GRANT ALL ON TABLE "public"."fids" TO "authenticated";
GRANT ALL ON TABLE "public"."fids" TO "service_role";

GRANT ALL ON TABLE "public"."fnames" TO "anon";
GRANT ALL ON TABLE "public"."fnames" TO "authenticated";
GRANT ALL ON TABLE "public"."fnames" TO "service_role";

GRANT ALL ON TABLE "public"."image_embeddings" TO "anon";
GRANT ALL ON TABLE "public"."image_embeddings" TO "authenticated";
GRANT ALL ON TABLE "public"."image_embeddings" TO "service_role";

GRANT ALL ON TABLE "public"."kysely_migration" TO "anon";
GRANT ALL ON TABLE "public"."kysely_migration" TO "authenticated";
GRANT ALL ON TABLE "public"."kysely_migration" TO "service_role";

GRANT ALL ON TABLE "public"."kysely_migration_lock" TO "anon";
GRANT ALL ON TABLE "public"."kysely_migration_lock" TO "authenticated";
GRANT ALL ON TABLE "public"."kysely_migration_lock" TO "service_role";

GRANT ALL ON TABLE "public"."links" TO "anon";
GRANT ALL ON TABLE "public"."links" TO "authenticated";
GRANT ALL ON TABLE "public"."links" TO "service_role";

GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";

GRANT ALL ON TABLE "public"."queries" TO "anon";
GRANT ALL ON TABLE "public"."queries" TO "authenticated";
GRANT ALL ON TABLE "public"."queries" TO "service_role";

GRANT ALL ON TABLE "public"."reactions" TO "anon";
GRANT ALL ON TABLE "public"."reactions" TO "authenticated";
GRANT ALL ON TABLE "public"."reactions" TO "service_role";

GRANT ALL ON TABLE "public"."signers" TO "anon";
GRANT ALL ON TABLE "public"."signers" TO "authenticated";
GRANT ALL ON TABLE "public"."signers" TO "service_role";

GRANT ALL ON TABLE "public"."storage_allocations" TO "anon";
GRANT ALL ON TABLE "public"."storage_allocations" TO "authenticated";
GRANT ALL ON TABLE "public"."storage_allocations" TO "service_role";

GRANT ALL ON TABLE "public"."user_data" TO "anon";
GRANT ALL ON TABLE "public"."user_data" TO "authenticated";
GRANT ALL ON TABLE "public"."user_data" TO "service_role";

GRANT ALL ON TABLE "public"."username_proofs" TO "anon";
GRANT ALL ON TABLE "public"."username_proofs" TO "authenticated";
GRANT ALL ON TABLE "public"."username_proofs" TO "service_role";

GRANT ALL ON TABLE "public"."verifications" TO "anon";
GRANT ALL ON TABLE "public"."verifications" TO "authenticated";
GRANT ALL ON TABLE "public"."verifications" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
