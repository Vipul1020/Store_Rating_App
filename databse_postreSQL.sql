PGDMP      9                }            store_ratings_pg_db    17.4    17.4 +    K           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            L           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            M           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            N           1262    16388    store_ratings_pg_db    DATABASE     y   CREATE DATABASE store_ratings_pg_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';
 #   DROP DATABASE store_ratings_pg_db;
                     postgres    false            S           1247    16390 	   user_role    TYPE     W   CREATE TYPE public.user_role AS ENUM (
    'admin',
    'normal',
    'store_owner'
);
    DROP TYPE public.user_role;
       public               postgres    false            �            1259    16433    ratings    TABLE     �  CREATE TABLE public.ratings (
    rating_id integer NOT NULL,
    user_id integer NOT NULL,
    store_id integer NOT NULL,
    rating_value integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ratings_rating_value_check CHECK (((rating_value >= 1) AND (rating_value <= 5)))
);
    DROP TABLE public.ratings;
       public         heap r       postgres    false            O           0    0    TABLE ratings    COMMENT     N   COMMENT ON TABLE public.ratings IS 'Stores user ratings for specific stores';
          public               postgres    false    222            P           0    0    COLUMN ratings.rating_value    COMMENT     N   COMMENT ON COLUMN public.ratings.rating_value IS 'The rating value (1 to 5)';
          public               postgres    false    222            �            1259    16432    ratings_rating_id_seq    SEQUENCE     �   CREATE SEQUENCE public.ratings_rating_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.ratings_rating_id_seq;
       public               postgres    false    222            Q           0    0    ratings_rating_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.ratings_rating_id_seq OWNED BY public.ratings.rating_id;
          public               postgres    false    221            �            1259    16413    stores    TABLE     A  CREATE TABLE public.stores (
    store_id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255),
    address text NOT NULL,
    owner_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.stores;
       public         heap r       postgres    false            R           0    0    TABLE stores    COMMENT     W   COMMENT ON TABLE public.stores IS 'Stores information about registered retail stores';
          public               postgres    false    220            �            1259    16412    stores_store_id_seq    SEQUENCE     �   CREATE SEQUENCE public.stores_store_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.stores_store_id_seq;
       public               postgres    false    220            S           0    0    stores_store_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.stores_store_id_seq OWNED BY public.stores.store_id;
          public               postgres    false    219            �            1259    16398    users    TABLE       CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(60) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    address text,
    role public.user_role NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.users;
       public         heap r       postgres    false    851            T           0    0    TABLE users    COMMENT     I   COMMENT ON TABLE public.users IS 'Stores user accounts and their roles';
          public               postgres    false    218            U           0    0    COLUMN users.user_id    COMMENT     L   COMMENT ON COLUMN public.users.user_id IS 'Unique identifier for the user';
          public               postgres    false    218            �            1259    16397    users_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public               postgres    false    218            V           0    0    users_user_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;
          public               postgres    false    217            �           2604    16436    ratings rating_id    DEFAULT     v   ALTER TABLE ONLY public.ratings ALTER COLUMN rating_id SET DEFAULT nextval('public.ratings_rating_id_seq'::regclass);
 @   ALTER TABLE public.ratings ALTER COLUMN rating_id DROP DEFAULT;
       public               postgres    false    222    221    222            �           2604    16416    stores store_id    DEFAULT     r   ALTER TABLE ONLY public.stores ALTER COLUMN store_id SET DEFAULT nextval('public.stores_store_id_seq'::regclass);
 >   ALTER TABLE public.stores ALTER COLUMN store_id DROP DEFAULT;
       public               postgres    false    220    219    220            �           2604    16401    users user_id    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public               postgres    false    217    218    218            H          0    16433    ratings 
   TABLE DATA           e   COPY public.ratings (rating_id, user_id, store_id, rating_value, created_at, updated_at) FROM stdin;
    public               postgres    false    222   �0       F          0    16413    stores 
   TABLE DATA           b   COPY public.stores (store_id, name, email, address, owner_id, created_at, updated_at) FROM stdin;
    public               postgres    false    220   �1       D          0    16398    users 
   TABLE DATA           k   COPY public.users (user_id, name, email, password_hash, address, role, created_at, updated_at) FROM stdin;
    public               postgres    false    218   >2       W           0    0    ratings_rating_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.ratings_rating_id_seq', 5, true);
          public               postgres    false    221            X           0    0    stores_store_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.stores_store_id_seq', 3, true);
          public               postgres    false    219            Y           0    0    users_user_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.users_user_id_seq', 7, true);
          public               postgres    false    217            �           2606    16441    ratings ratings_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (rating_id);
 >   ALTER TABLE ONLY public.ratings DROP CONSTRAINT ratings_pkey;
       public                 postgres    false    222            �           2606    16424    stores stores_email_key 
   CONSTRAINT     S   ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_email_key UNIQUE (email);
 A   ALTER TABLE ONLY public.stores DROP CONSTRAINT stores_email_key;
       public                 postgres    false    220            �           2606    16422    stores stores_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (store_id);
 <   ALTER TABLE ONLY public.stores DROP CONSTRAINT stores_pkey;
       public                 postgres    false    220            �           2606    16443     ratings user_store_unique_rating 
   CONSTRAINT     h   ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT user_store_unique_rating UNIQUE (user_id, store_id);
 J   ALTER TABLE ONLY public.ratings DROP CONSTRAINT user_store_unique_rating;
       public                 postgres    false    222    222            �           2606    16409    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 postgres    false    218            �           2606    16407    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    218            �           1259    16454    idx_rating_store    INDEX     H   CREATE INDEX idx_rating_store ON public.ratings USING btree (store_id);
 $   DROP INDEX public.idx_rating_store;
       public                 postgres    false    222            �           1259    16455    idx_rating_user    INDEX     F   CREATE INDEX idx_rating_user ON public.ratings USING btree (user_id);
 #   DROP INDEX public.idx_rating_user;
       public                 postgres    false    222            �           1259    16430    idx_store_name    INDEX     A   CREATE INDEX idx_store_name ON public.stores USING btree (name);
 "   DROP INDEX public.idx_store_name;
       public                 postgres    false    220            �           1259    16431    idx_store_owner    INDEX     F   CREATE INDEX idx_store_owner ON public.stores USING btree (owner_id);
 #   DROP INDEX public.idx_store_owner;
       public                 postgres    false    220            �           1259    16410    idx_user_email    INDEX     A   CREATE INDEX idx_user_email ON public.users USING btree (email);
 "   DROP INDEX public.idx_user_email;
       public                 postgres    false    218            �           1259    16411    idx_user_role    INDEX     ?   CREATE INDEX idx_user_role ON public.users USING btree (role);
 !   DROP INDEX public.idx_user_role;
       public                 postgres    false    218            �           2606    16449    ratings fk_rating_store    FK CONSTRAINT     �   ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT fk_rating_store FOREIGN KEY (store_id) REFERENCES public.stores(store_id) ON DELETE CASCADE;
 A   ALTER TABLE ONLY public.ratings DROP CONSTRAINT fk_rating_store;
       public               postgres    false    222    220    4776            �           2606    16444    ratings fk_rating_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT fk_rating_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
 @   ALTER TABLE ONLY public.ratings DROP CONSTRAINT fk_rating_user;
       public               postgres    false    4770    218    222            �           2606    16425    stores fk_store_owner    FK CONSTRAINT     �   ALTER TABLE ONLY public.stores
    ADD CONSTRAINT fk_store_owner FOREIGN KEY (owner_id) REFERENCES public.users(user_id) ON DELETE SET NULL;
 ?   ALTER TABLE ONLY public.stores DROP CONSTRAINT fk_store_owner;
       public               postgres    false    220    218    4770            H   s   x�u�AAD�us
�fE�`s�;�rl������n������H�>�M�1�$N~�pu8�F�5��<�|S��Q�/�l�u�M; �J�|���j�������M6�      F   �   x���1�0F��Wd׆\.51�ݥ�.)m��@-��U
�Ղ����= �>v.7�k[��b;N�c�� R�4*d ��GF��H-�� �$�[���fyd�gpݐ�T��֚�>�"���J��#�0��^(��g�7�x=�c�������j�z9�ЂSJ_��]%      D   �  x���K��0 �3�
�v7&!!�i}���	Z[5�����t;8���PIUW�פs�R�9����x(X����h�`�G���
��
2?�+d��}���ŵ���-�c���u��U�J�2�9g�������j�Sb��H� �)���
U�A����|G�b?��(�nj?���)�3���M��ލ`O�����, ��Ys�0z$L6tKw�ru�Tj�nʅ(/�V�vt���h�?.�<.x��-���_ml*V�]�/��L�uCkMx'��4`�KB�ݽ:��]wW�Weۯ:���,9��Ky��=�������)PF�\nac!@�F�#@$B����[1w�~xo,oɲ��e����w���e�6��	�x����6����k`Z!�L��S��:t�2.܆��z�G�.#�" �F�	�Y�H?�g��UЏs�λ�����A�r໹9'��OU�.Ԫսu���is�'��p92t��,�<�#�2��_
���������׍�y�`{M[��>Sf��Ѱ>�δ�Gu:ӈ��R�Xe��~���9L�	H�T�y)@d�����K�V(���Lu^�ֻ3M\y��&�y��q���D�ƍ�an�d��v���+�_nT.L-�޻φ���6`�(&O������K���(�`�t�     