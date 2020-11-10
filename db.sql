create table `users`( id integer primary key auto_increment, name varchar(40), gender varchar(5), birthday date, address varchar(50), email varchar(40), hashedPassword varchar(50), identCard varchar(50), verificated tinyint(1), phoneNum varchar(15), photoProfile varchar(50), createdAt timestamp default CURRENT_TIMESTAMP )

create table `gigs`( id integer primary key auto_increment, id_owner integer references users(id), applier varchar(140) default null, apply integer, title varchar(50),gigType varchar(8), category varchar(50), jobDesc varchar(200), salary integer(10), workTime integer(40), gigLoc varchar(200), city varchar(50), verificated tinyint(1),  createdAt timestamp default CURRENT_TIMESTAMP)

create table `histories`( id integer primary key, id_user integer references users(id), category varchar(40), jobDesc varchar(150), salary integer, workTime varchar (40), workdate date, gigLoc varchar(100), star float, review varchar(100), createdAt timestamp default CURRENT_TIMESTAMP )

// buat gigs baru
create table `gigs`( id integer primary key auto_increment, id_owner integer references users(id), applier varchar(140) default null, apply integer, title varchar(50),gigType varchar(8), category varchar(50), jobDesc varchar(200), salary integer(10), workTime varchar(40), gigLoc varchar(200), city varchar(50), verificated tinyint(1),  createdAt timestamp default CURRENT_TIMESTAMP)

create table `workers`( 
    id integer primary key auto_increment, 
    userId integer, 
    category varchar(40), 
    skills varchar(100), 
    status tinyint(1), 
    workDate date, 
    workTime varchar(40), 
    avgRate float, 
    countTask integer default null, 
    complete integer default null,
     createdAt timestamp default CURRENT_TIMESTAMP)
