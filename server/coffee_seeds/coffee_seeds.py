from models import Coffee, CoffeeProfile

def seed_coffees():
    test_coffees = []
    test_coffee_profiles = []
    test_coffee_1 = Coffee(
        id=1,
        name='Papua New Guinea Eastern Highlands',
        producer='Atlas Coffee Club',
        product_type='whole bean',
        weight=340,
        roast=20
    )
    test_coffee_1_profile = CoffeeProfile(
        country='Papua New Guinea',
        region='Eastern Highlands',
        farm='AAK',
        continent='Asia',
        altitude='very high',
        process='washed',
        is_specialty=True,
        coffee_id=1
    )

    test_coffee_2 = Coffee(
        id=2,
        name='India Tamil Nadu',
        producer='Atlas Coffee Club',
        product_type='whole bean',
        weight=340,
        image='coffee_seeds/coffee_2.jpg',
        roast=20
    )
    test_coffee_2_profile = CoffeeProfile(
        country='India',
        region='Tamil Nadu',
        farm='Riverdale Estates',
        continent='Asia',
        altitude='very high',
        process='washed',
        is_specialty=True,
        coffee_id=2
    )

    test_coffee_3 = Coffee(
        id=3,
        name='Classic Decaf',
        producer='Folgers',
        product_type='ground',
        weight=272,
        is_decaf=True,
        image='coffee_seeds/coffee_3.jpg',
        roast=50
    )
    test_coffee_3_profile = CoffeeProfile(
        coffee_id=3
    )

    test_coffee_4 = Coffee(
        id=4,
        name='Craft Instant Espresso Multiserve',
        producer='Blue Bottle',
        product_type='instant',
        weight=48,
        image='coffee_seeds/coffee_4.jpg',
        roast=70
    )
    test_coffee_4_profile = CoffeeProfile(
        coffee_id=4
    )

    test_coffee_5 = Coffee(
        id=5,
        name='Colombia Pink Bourbon Natural',
        producer='Paradise Coffee Roasters',
        product_type='whole bean',
        image='coffee_seeds/coffee_5.jpg',
        roast=10
    )
    test_coffee_5_profile = CoffeeProfile(
        country='Colombia',
        region='Huila',
        farm='Finca El Corozal',
        continent='South America',
        altitude='very high',
        process='Natural',
        is_specialty=True,
        variety='Colombian Pink Bourbon',
        coffee_id=5
    )
    test_coffees.extend([
        test_coffee_1,
        test_coffee_2,
        test_coffee_3,
        test_coffee_4,
        test_coffee_5
        ])
    test_coffee_profiles.extend([
        test_coffee_1_profile,
        test_coffee_2_profile,
        test_coffee_3_profile,
        test_coffee_4_profile,
        test_coffee_5_profile
        ])
    # return test_coffees + test_coffee_profiles
     