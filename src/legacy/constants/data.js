export const TESTIMONIALS = [
    {
        name: 'Ollie Smeenk',
        company: 'Kukua',
        position: 'Founder',
        image: require('../images/testimonials/ollie.png'),
        message:
            "As a startup, Tunga offers the flexible software development capacity we need to grow. We've been developing our mobile app which targets agri professionals in Africa with Tunga. It's great that the Tunga developers really understand the local needs and are proactive in finding the right technology for our users. What I also like is the way Tunga makes sure that I’m always informed of what’s going on",
    },
    {
        name: 'Thami Schweichler',
        company: 'Makers Unite',
        position: 'Director',
        image: require('../images/testimonials/Thami.png'),
        message:
            'We quickly needed some fixes on our webshop website. Tunga was able to quickly mobilize the right developer to work on our website. I can say that we were presently surprised with the quality of the developers and also with the high service level. We will definitely work with Tunga again if we need development capacity. ',
        wizard: true,
    },
    {
        name: 'Ineke Aquarius',
        company: 'Mango Tree',
        position: 'Director',
        image: require('../images/testimonials/ineke.png'),
        message:
            "We've been developing several mobile applications with the guys from Tunga. What I like about working with them is that they are communicating clearly, and are very knowledgeable and proactive. Via the Tunga platform and its daily progress report, I am always in control over the progress of the projects that are running for our company. The Tunga people have a great customer mindset: they make things work for no matter what happens or changes.",
        wizard: true,
    },
    {
        name: 'Annemiek Pronk',
        company: 'Impulse',
        position: 'Director',
        image: require('../images/testimonials/Annemiek.png'),
        message:
            "As a startup with a technical proposition but not being developers ourselves, we needed a reliable partner to develop our product with. Tunga has consulted us to figure out the best technical approach and developed our product in clear sprints ever since. For companies that don't have the technical know-how, Tunga is a reliable partner that can scale up easily with your software development needs.",
        wizard: true,
    },
    {
        name: 'Kasper Spruyt',
        company: 'CWZ',
        position: 'Director',
        image: require('../images/testimonials/Kasper.png'),
        message:
            'Tunga is a great development partner. After finishing a first app, we are currently developing a second mobile application for our elderly care company with a team of Tunga developers. I am not a techy person myself, so it is great that Tunga offers project managers that take care of planning, scoping and managing the team. Having a single point of contact at Tunga that effectively keeps me in the loop, gives me the freedom to work on the growth of my company. \n',
        wizard: true,
    },
];

export function getClientTestimonials(max = 0) {
    var client_testimonials = [];
    TESTIMONIALS.map(item => {
        if (item.wizard) {
            client_testimonials.push(item);
        }
    });
    return client_testimonials.slice(0, max ? max : TESTIMONIALS.length);
}
