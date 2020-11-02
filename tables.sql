create table towns
(
	id serial not null primary key,
	town_name text not null,
	starts_with text not null
);

create table registrations
(
	id serial not null primary key,
	reg_number text not null,
	town_id int not null,
	foreign key (town_id) references towns(id)
);



--  insert into towns(town_name, starts_with) values('Cape Town','CA');
--  insert into towns(town_name, starts_with) values('Bellville', 'CY');
--  insert into towns(town_name, starts_with) values('Paarl', 'CJ');



