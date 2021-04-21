const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({ name: String, address: String });

const AdminLinkSchema = new mongoose.Schema({
    title: String,
    description: String,
    links: [
        {
            href: String,
            title: String,
            description: String,
        },
    ],
});

module.exports = mongoose.Schema({
    id: String,
    main: {
        name: String,
        colorScheme: String,
        logoUrl: [String],
    },
    menu: [LinkSchema],
    admin_menu: [AdminLinkSchema],
    front_page: {
        show_banner: Boolean,
        show_promoted: Boolean,
        banner_height: Number,
        promoted_width: Number,
    },
});
