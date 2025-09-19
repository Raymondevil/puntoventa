-- Insertar productos del menú - HAMBURGUESAS
INSERT OR IGNORE INTO menu_items (category, name, base_ingredients, base_price) VALUES
('hamburguesas', 'Asadera', 'Carne+Q.Asadero', 63),
('hamburguesas', 'Especial', 'Carne+Carnes Frías', 63),
('hamburguesas', 'Doble', 'Carne+Jamón+Q.Amarillo', 60),
('hamburguesas', 'Champiqueso', 'Carne+Champiñón+Q.Asadero', 76),
('hamburguesas', 'Petra', 'Carne+Q.Asadero+Tocino', 78),
('hamburguesas', 'Campechana', 'Asadera+Jamón+Q.Amarillo', 73),
('hamburguesas', 'Ejecutiva', 'Carne+Carnes Frías+Salchicha', 95),
('hamburguesas', 'Española', 'Carne+Q.Asadero+Salchicha', 95),
('hamburguesas', 'Embajadora', 'Carne+Carnes Frías+Q.Asadero+Salchicha', 108),
('hamburguesas', 'Americana', 'Doble Carne+Doble Q.Amarillo', 100),
('hamburguesas', 'Choriqueso', 'Chorizo+Q.Asadero', 45),
('hamburguesas', 'Ranchera', 'Carne+Chorizo+Q.Asadero', 76),
('hamburguesas', 'Hawaiana', 'Carne+Piña+Q.Asadero', 76),
('hamburguesas', 'Hawaiana Especial', 'Carne+Piña+Q.Asadero+Carnes Frías', 89),
('hamburguesas', 'Especial Asadera', 'Carne+Q.Asadero+Carnes Frías', 76),
('hamburguesas', 'Ahumada', 'Chuleta', 50),
('hamburguesas', 'Ahumada Especial', 'Chuleta+Carnes Frías', 63),
('hamburguesas', 'Mexicana', 'Chuleta+Carne', 84),
('hamburguesas', 'Norteña', 'Carne+Chuleta+Q.Asadero', 97),
('hamburguesas', 'Italiana', 'Chuleta+Q.Asadero', 63),
('hamburguesas', 'Extravagante', 'Carne+Chuleta+Q.Asadero+Carnes Frías', 110),
('hamburguesas', 'Descarnada', 'Carnes Frías+Q.Amarillo', 48),
('hamburguesas', 'Descarnada Asadero', 'Carnes Frías+Q.Amarillo+Q.Asadero', 61),
('hamburguesas', 'Sencilla', 'Carne de Res', 50),
('hamburguesas', 'Big Sencilla', '2 Carnes de Res', 84),
('hamburguesas', 'Costeña', 'Camarón+Q.Asadero+Tocino+Ch.Morrón+Sal.Inglesa', 96),
('hamburguesas', 'Super Costeña', 'Camarón+Q.Asadero+Carne de Res+Tocino+Ch.Morrón', 130),
('hamburguesas', 'La Popotiña', 'Carne de Pierna+Tocino+Chile Morrón+Q.Asadero', 82),
('hamburguesas', 'Grosera', 'Salchicha para Asar+Q.Asadero+Tocino', 60),
('hamburguesas', 'Super Grosera', 'Salchicha para Asar+Q.Asadero+Tocino+Carne de Res', 94);

-- Insertar productos del menú - HOTDOGS
INSERT OR IGNORE INTO menu_items (category, name, base_ingredients, base_price) VALUES
('hotdogs', 'Dogo de Pavo', 'Salchicha de Pavo', 50),
('hotdogs', 'Grosero', 'Salchicha para Asar+Q.Asadero+Tocino Rebanado', 60),
('hotdogs', 'Asadero', 'Salchicha+Q.Asadero', 73),
('hotdogs', 'Big Grosero', 'Grosero+Carnes Frías', 76),
('hotdogs', 'Choriqueso', 'Salchicha+Chorizo+Q.Asadero', 76),
('hotdogs', 'Champiqueso', 'Salchicha+Champiñones+Q.Asadero', 63),
('hotdogs', 'Campechano', 'Asadero+Jamón+Q.Amarillo', 73),
('hotdogs', 'Especial', 'Salchicha+C.Frías', 63),
('hotdogs', 'Hawaiano', 'Salchicha+Q.Asadero+Piña', 76),
('hotdogs', 'Hawaiano Especial', 'Salchicha+Q.Asadero+Piña+C.Frías', 89),
('hotdogs', 'Doble', 'Salchicha+Jamón+Q.Amarillo', 60),
('hotdogs', 'Descarnado', 'Jamón+Pastel+Q.de Puerco+Mortadela+Salami', 48),
('hotdogs', 'de Pierna', 'Salchicha de Pierna', 48);

-- Insertar productos del menú - SINCRONIZADAS
INSERT OR IGNORE INTO menu_items (category, name, base_ingredients, base_price) VALUES
('sincronizadas', 'Sincronizada Sencilla', 'T.Harina+Jamón+Q.Asadero+Q.Amarillo', 51),
('sincronizadas', 'Sincronizada Especial', 'T.Harina+Jamón+Q.Asadero+Q.Amarillo+Pierna', 81),
('sincronizadas', 'Sincronizada Super', 'T.Harina+Jamón+Q.Asadero+Q.Amarillo+Champiñones', 64),
('sincronizadas', 'Sincronizada Matona', 'T.Harina+Jamón+Q.Asadero+Q.Amarillo+Pierna+Salchicha Grosera', 125),
('sincronizadas', 'Sincronizada Costeña', 'T.Harina+Jamón+Q.Asadero+Q.Amarillo+Camarón+Pierna', 125);

-- Insertar productos del menú - TORTAS Y BURROS
INSERT OR IGNORE INTO menu_items (category, name, base_ingredients, base_price) VALUES
('tortas', 'Torta Sencilla', 'Telera+Pierna', 50),
('tortas', 'Torta Especial', 'Carnes Frías+Pierna', 63),
('tortas', 'Torta Asadera', 'Pierna+Q.Asadero', 63),
('tortas', 'Torta Cubana', 'Jamón+Q.Asadero+Salchicha+Pierna', 101),
('burros', 'Burro Sencillo', 'Carne de Pierna', 50),
('burros', 'Burro Asadero', 'Carne de Pierna+Q.Asadero', 63),
('burros', 'Burro Especial', 'Carne de Pierna+Carnes Frías', 63),
('burros', 'Burro Costeño', 'Carne de Pierna+Camarón+Q.Asadero', 106);

-- Insertar ingredientes extras
INSERT OR IGNORE INTO extra_ingredients (name, price, category) VALUES
('Carne', 34, 'extra'),
('Carnes Frías', 13, 'extra'),
('Q. Asadero', 13, 'extra'),
('Salchicha para Asar', 44, 'extra'),
('Piña', 13, 'extra'),
('Champiñón', 13, 'extra'),
('Salchicha de Pavo', 34, 'extra'),
('Chuleta', 34, 'extra'),
('Camarón', 46, 'extra'),
('Tocino', 15, 'extra'),
('Carne de Pierna', 34, 'extra'),
('Chorizo', 13, 'extra'),
('Q. Amarillo', 8, 'extra');

-- Insertar verduras y aderezos (sin precio, se incluyen por defecto)
INSERT OR IGNORE INTO extra_ingredients (name, price, category) VALUES
('Jitomate', 0, 'vegetable'),
('Cebolla', 0, 'vegetable'),
('Chile', 0, 'vegetable'),
('Crema', 0, 'sauce'),
('Mayonesa', 0, 'sauce'),
('Capsut', 0, 'sauce'),
('Mostaza', 0, 'sauce');