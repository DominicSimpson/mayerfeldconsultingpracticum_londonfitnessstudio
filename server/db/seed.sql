INSERT INTO products (id, category, title, description, price, features) 
/* Facilities */
VALUES ('gyms', 'facilities', 'Gyms', 
'Train your way with modern cardio machines, free weights, and strength equipment, 
with expert staff on hand to help you get started.', 20, NULL
),
('swimming_pools', 'facility', 'Swimming Pools', 
'Swim laps in our main pool or let the little ones splash safely in our dedicated 
children''s pool. We also have swimming lessons every week.', 10, NULL
),
('sauna_steamrooms', 'facility', 'Sauna and Steam Rooms', 
'Unwind after your workout in our sauna, spa, jacuzzi, and steam rooms, 
the perfect way to ease tired muscles.', 12, NULL 
),
('sports_courts', 'facility', 'Sports Courts', 
'Book a court for badminton, tennis, squash, or indoor football, 
whether you''re playing with friends or joining a game.', 15, NULL
),

/* Services */

('fitness_classes', 'service', 'Fitness Classes', 
'Strength, cardio and conditioning sessions for all levels.', 10, NULL
),
('zumba_classes', 'service', 'Zumba Classes', 
'High-energy dance workouts that feel more like a party.', 10, NULL
),
('nutrition_counselling', 'service', 'Nutrition Counselling', 
'One-to-one guidance to fuel your training and lifestyle.', 25, NULL
),
('wellness_programs', 'service', 'Wellness Programs',
'Stress management, recovery and mindfulness programmes.', 50, NULL
),

/* Membership */
('basic', 'membership', 'Basic',
 'Swimming pool access off-peak, plus pay-as-you-go classes at member rates.', 25, ARRAY[
    'Swimming pool (off-peak)',
    'Zumba and group classes at discounted member rates',
    'Wellness treatments at standard prices'
 ]),
 ('intermediate', 'membership', 'Intermediate',
 'Gym, pool and sauna off-peak, with a monthly allowance of group classes.', 45, ARRAY[
    'Gym, swimming pool and sauna (off-peak)',
    '4 group classes per month (Zumba, etc.)',
    '10% off wellness treatments',
    '1 free guest pass per month'
 ]),
('gold', 'membership', 'Gold',
'Unlimited access to every facility, class and wellness service at any time.', 70, ARRAY[
    'All facilities, any time (gym, pool, sauna)',
    'Unlimited group classes, including Zumba',
    '1 complimentary wellness session per month',
    '20% off additional wellness treatments',
    'Priority class booking',
    '2 guest passes per month'
])
ON CONFLICT (id) DO UPDATE SET
    category    = EXCLUDED.category,
    title       = EXCLUDED.title,
    description = EXCLUDED.description,
    price       = EXCLUDED.price,
    features    = EXCLUDED.features;
