/* Contenus des métiers de la démo vitrine (FR / AR / EN). Entreprises et personnes fictives.
   Photos : Unsplash · Vidéos : Pexels (licences libres, usage commercial autorisé). */
(function () {
  'use strict';
  var U = function (id) { return 'https://images.unsplash.com/photo-' + id; };
  var V = 'https://videos.pexels.com/video-files/';

  window.UI = {
    fr: {
      demo: 'Démo · Site vitrine', metier: 'Métier', manager: 'Espace gérant', viewSite: 'Voir le site',
      open: 'Ouvert maintenant · ferme à {t}', shut: 'Fermé · ouvre {w} à {t}', today: 'aujourd’hui', tomorrow: 'demain', excep: 'Fermé exceptionnellement', closedD: 'Fermé',
      call: 'Appeler', wa: 'WhatsApp', from: 'dès {p} DA', range: '{a} – {b} DA', quote: 'sur devis', min: 'min',
      estTotal: 'Estimation', estNone: 'Cochez ce qui vous intéresse pour voir une estimation.', estNote: 'Estimation indicative, confirmée après examen.', estBook: 'Réserver avec cette sélection',
      baBefore: 'Avant', baAfter: 'Après', baNote: 'Simulation visuelle de démonstration',
      q2: 'Quel jour ?', q3: 'Quelle heure ?', name: 'Nom et prénom', tel: 'Téléphone', test: '⚡ Remplir avec les infos de test', send: 'Envoyer la demande',
      err: 'Choisissez au moins un élément, un jour, une heure, et indiquez votre nom et un mobile valide.',
      sentH: 'Demande envoyée !', sentP: 'Confirmation par SMS au {tel}.<br>{what} · {when}.', again: 'Faire une autre demande', back: '← Retour au site',
      hoursEb: 'Horaires & accès', hoursH: 'Facile à trouver, facile à joindre.', itin: 'Itinéraire', at: 'à', photos: 'Photos : Unsplash · Vidéos : Pexels'
    },
    ar: {
      demo: 'عرض · موقع تعريفي', metier: 'المهنة', manager: 'فضاء المسيّر', viewSite: 'عرض الموقع',
      open: 'مفتوح الآن · يغلق على {t}', shut: 'مغلق · يفتح {w} على {t}', today: 'اليوم', tomorrow: 'غدًا', excep: 'مغلق استثنائيًا', closedD: 'مغلق',
      call: 'اتصال', wa: 'واتساب', from: 'ابتداءً من {p} دج', range: '{a} – {b} دج', quote: 'حسب التقدير', min: 'د',
      estTotal: 'التقدير', estNone: 'اختر ما يهمك لترى تقديرًا للسعر.', estNote: 'تقدير أولي، يُؤكَّد بعد الفحص.', estBook: 'احجز بهذا الاختيار',
      baBefore: 'قبل', baAfter: 'بعد', baNote: 'محاكاة بصرية للعرض',
      q2: 'أي يوم؟', q3: 'أي ساعة؟', name: 'الاسم واللقب', tel: 'الهاتف', test: '⚡ املأ ببيانات تجريبية', send: 'أرسل الطلب',
      err: 'اختر عنصرًا واحدًا على الأقل ويومًا وساعة، وأدخل اسمك ورقم هاتف صحيح.',
      sentH: 'تم إرسال الطلب!', sentP: 'التأكيد برسالة قصيرة على {tel}.<br>{what} · {when}.', again: 'طلب جديد', back: 'العودة إلى الموقع →',
      hoursEb: 'الأوقات والعنوان', hoursH: 'سهل الوصول، سهل الاتصال.', itin: 'الاتجاهات', at: 'على', photos: 'الصور: Unsplash · الفيديو: Pexels'
    },
    en: {
      demo: 'Demo · Showcase website', metier: 'Business', manager: 'Manager area', viewSite: 'View site',
      open: 'Open now · closes at {t}', shut: 'Closed · opens {w} at {t}', today: 'today', tomorrow: 'tomorrow', excep: 'Exceptionally closed', closedD: 'Closed',
      call: 'Call', wa: 'WhatsApp', from: 'from {p} DZD', range: '{a} – {b} DZD', quote: 'on quote', min: 'min',
      estTotal: 'Estimate', estNone: 'Tick what you are interested in to see an estimate.', estNote: 'Indicative estimate, confirmed after examination.', estBook: 'Book with this selection',
      baBefore: 'Before', baAfter: 'After', baNote: 'Visual simulation for demo purposes',
      q2: 'Which day?', q3: 'What time?', name: 'Full name', tel: 'Phone', test: '⚡ Fill with test details', send: 'Send request',
      err: 'Pick at least one item, a day and a time, and enter your name and a valid mobile number.',
      sentH: 'Request sent!', sentP: 'Confirmation by text message to {tel}.<br>{what} · {when}.', again: 'Make another request', back: '← Back to the site',
      hoursEb: 'Opening hours & access', hoursH: 'Easy to find, easy to reach.', itin: 'Directions', at: 'at', photos: 'Photos: Unsplash · Videos: Pexels'
    }
  };

  window.SECTORS = {
    // ===================== Cabinet dentaire =====================
    cabinet: {
      key: 'cabinet', label: { fr: 'Cabinet dentaire', ar: 'عيادة أسنان', en: 'Dental practice' },
      brand: { fr: 'Ibtissama', ar: 'ابتسامة', en: 'Ibtissama' }, sub: { fr: 'Cabinet dentaire · Blida', ar: 'عيادة أسنان · البليدة', en: 'Dental practice · Blida' }, icon: 'tooth',
      theme: { dark: 0, p: '#1f4a43', pd: '#163731', pt: '#ece5d8', bg: '#f4f0e9', bg2: '#ebe5da', card: '#fbf9f5', ink: '#1c1917', mut: '#6b645c', bd: 'rgba(28,25,23,.11)', field: '#ffffff', deep: '#1f4a43', on: '#ffffff', eb: '#9a7643', hl: '#dcc79f', urg: '#b42318', urgInk: '#ffffff' },
      logo: { mark: 'tooth', upper: 0 },
      video: { hd: V + '7803281/7803281-hd_1920_1078_30fps.mp4', sd: V + '7803281/7803281-sd_960_540_30fps.mp4', poster: 'https://images.pexels.com/videos/7803281/adult-chair-clinic-dental-7803281.jpeg?auto=compress&cs=tinysrgb&w=1600' },
      phone: '025 12 34 56', domain: 'ibtissama-dentaire.dz',
      hours: [['09:00', '18:00'], ['09:00', '18:00'], ['09:00', '18:00'], ['09:00', '18:00'], ['09:00', '13:00'], null, ['09:00', '18:00']],
      hero: {
        eb: { fr: 'Cabinet dentaire à Blida', ar: 'عيادة أسنان في البليدة', en: 'Dental practice in Blida' },
        h1: { fr: 'Des soins dentaires <em>en douceur</em>, sans appréhension.', ar: 'علاج أسنان <em>بلطف</em> ودون خوف.', en: 'Gentle dental care, <em>without the fear.</em>' },
        lead: { fr: 'Consultations, soins, esthétique et implants. Une équipe qui explique chaque geste, et des rendez-vous qui tiennent l’horaire.', ar: 'فحوصات وعلاجات وتجميل وزراعة. فريق يشرح كل خطوة، ومواعيد تُحترم.', en: 'Check-ups, treatments, cosmetic dentistry and implants. A team that explains every step, and appointments that run on time.' },
        book: { fr: 'Prendre rendez-vous', ar: 'احجز موعدًا', en: 'Book an appointment' },
        second: { fr: 'Estimer mon devis', ar: 'قدّر تكلفة علاجي', en: 'Estimate my quote' }
      },
      trust: [['4,9/5', { fr: 'note des patients', ar: 'تقييم المرضى', en: 'patient rating' }], ['15', { fr: 'ans d’expérience', ar: 'سنة خبرة', en: 'years of experience' }], ['3 000+', { fr: 'rendez-vous par an', ar: 'موعد في السنة', en: 'appointments a year' }]],
      nav: { fr: ['Soins', 'Devis', 'Avant / après', 'Avis', 'Accès'], ar: ['العلاجات', 'التقدير', 'قبل / بعد', 'الآراء', 'العنوان'], en: ['Treatments', 'Quote', 'Before / after', 'Reviews', 'Access'] },
      urgent: {
        btn: { fr: 'Urgence dentaire', ar: 'حالة طارئة', en: 'Dental emergency' },
        title: { fr: 'Une douleur, un choc, une dent cassée ?', ar: 'ألم، صدمة، سن مكسورة؟', en: 'Pain, a knock, a broken tooth?' },
        text: { fr: 'Appelez-nous : les urgences sont prises le jour même, entre deux rendez-vous.', ar: 'اتصل بنا: الحالات الطارئة تُستقبل في اليوم نفسه.', en: 'Call us: emergencies are seen the same day, between appointments.' },
        tips: { fr: ['Dent cassée : gardez le morceau dans du lait.', 'Gonflement : froid sur la joue, pas de chaud.', 'Douleur : paracétamol, jamais d’aspirine sur la gencive.'], ar: ['سن مكسورة: احتفظ بالقطعة في الحليب.', 'انتفاخ: ضع البرد على الخد، لا الحرارة.', 'ألم: باراسيتامول، ولا تضع الأسبرين على اللثة.'], en: ['Broken tooth: keep the piece in milk.', 'Swelling: cold on the cheek, never heat.', 'Pain: paracetamol, never aspirin on the gum.'] }
      },
      services: {
        eb: { fr: 'Nos soins', ar: 'علاجاتنا', en: 'Our treatments' }, h: { fr: 'Tout pour un sourire en bonne santé.', ar: 'كل ما يلزم لابتسامة صحية.', en: 'Everything for a healthy smile.' },
        lead: { fr: 'Des tarifs affichés, pour venir sans mauvaise surprise.', ar: 'أسعار معلنة حتى تأتي دون مفاجآت.', en: 'Prices shown up front, so there are no surprises.' },
        items: [
          { id: 'consult', img: U('1777331903190-341a3dd0441b'), ic: 'search', min: 1500, max: 1500, dur: 30, n: { fr: 'Consultation et bilan', ar: 'فحص وتشخيص', en: 'Check-up' }, d: { fr: 'On fait le point et on vous explique tout, sans jargon.', ar: 'نفحص ونشرح لك كل شيء بوضوح.', en: 'We assess and explain everything, in plain words.' } },
          { id: 'detart', img: U('1657470179447-0f5aa16daa91'), ic: 'drop', min: 2500, max: 3500, dur: 30, n: { fr: 'Détartrage', ar: 'إزالة الجير', en: 'Scaling & cleaning' }, d: { fr: 'Gencives saines et dents nettes, en une séance.', ar: 'لثة صحية وأسنان نظيفة في جلسة واحدة.', en: 'Healthy gums and clean teeth in one visit.' } },
          { id: 'carie', img: U('1663755489920-5e09f66d011a'), ic: 'tooth', min: 3000, max: 6000, dur: 45, n: { fr: 'Soins des caries', ar: 'علاج التسوس', en: 'Fillings' }, d: { fr: 'Des soins précis et sans douleur.', ar: 'علاج دقيق وبدون ألم.', en: 'Precise, pain-free treatment.' } },
          { id: 'blanc', img: U('1654373535457-383a0a4d00f9'), ic: 'spark', min: 25000, max: 35000, dur: 60, n: { fr: 'Blanchiment', ar: 'تبييض الأسنان', en: 'Teeth whitening' }, d: { fr: 'Un sourire éclatant, en toute sécurité.', ar: 'ابتسامة مشرقة بأمان تام.', en: 'A brighter smile, safely.' } },
          { id: 'implant', img: U('1787303856266-8c4f0b61ecf1'), ic: 'pin', min: 80000, max: 120000, dur: 90, n: { fr: 'Implant dentaire', ar: 'زراعة الأسنان', en: 'Dental implant' }, d: { fr: 'Remplacer une dent manquante, durablement.', ar: 'تعويض السن المفقودة بشكل دائم.', en: 'Replace a missing tooth for good.' } },
          { id: 'align', img: U('1777793636393-a0fec488f3fb'), ic: 'smile', min: 180000, max: 320000, dur: 45, n: { fr: 'Aligneurs transparents', ar: 'تقويم شفاف', en: 'Clear aligners' }, d: { fr: 'Redresser les dents discrètement.', ar: 'تقويم الأسنان بشكل خفي.', en: 'Straighten teeth discreetly.' } }
        ]
      },
      estim: { eb: { fr: 'Simulateur de devis', ar: 'محاكي التكلفة', en: 'Quote estimator' }, h: { fr: 'Combien ça va coûter ? Estimez-le en 10 secondes.', ar: 'كم سيكلف؟ قدّره في 10 ثوانٍ.', en: 'How much will it cost? Find out in 10 seconds.' }, lead: { fr: 'Cochez les soins qui vous concernent : vous obtenez une fourchette de prix et la durée, puis vous réservez directement.', ar: 'اختر العلاجات التي تهمك: تحصل على نطاق السعر والمدة، ثم تحجز مباشرة.', en: 'Tick the treatments you need: you get a price range and duration, then book straight away.' } },
      ba: { img: U('1769559893692-c6d0623bf8e4'), before: 'sepia(.55) saturate(1.4) hue-rotate(-12deg) brightness(.9) contrast(.95)', eb: { fr: 'Avant / après', ar: 'قبل / بعد', en: 'Before / after' }, h: { fr: 'Le blanchiment, en un geste.', ar: 'التبييض بلمسة واحدة.', en: 'Whitening, at a glance.' }, lead: { fr: 'Faites glisser pour comparer. Vos patients voient le résultat avant de se décider.', ar: 'اسحب للمقارنة. يرى مرضاك النتيجة قبل اتخاذ القرار.', en: 'Drag to compare. Patients see the result before they decide.' } },
      gallery: null,
      reviews: { eb: { fr: 'Avis patients', ar: 'آراء المرضى', en: 'Patient reviews' }, h: { fr: 'Ils nous ont confié leur sourire.', ar: 'وثقوا بنا في ابتسامتهم.', en: 'They trusted us with their smile.' }, items: [
        [{ fr: 'J’avais une vraie peur du dentiste. Tout m’a été expliqué avant chaque geste, je n’ai rien senti.', ar: 'كنت أخاف كثيرًا من طبيب الأسنان. شُرح لي كل شيء ولم أشعر بأي ألم.', en: 'I was genuinely scared of dentists. Every step was explained and I felt nothing.' }, 'Nadia B.', { fr: 'Soins des caries', ar: 'علاج التسوس', en: 'Fillings' }],
        [{ fr: 'Rendez-vous pris le soir sur le site, confirmé le lendemain par SMS. Simple.', ar: 'حجزت ليلًا من الموقع وتم التأكيد صباحًا برسالة. بسيط.', en: 'Booked online in the evening, confirmed by text the next morning. Easy.' }, 'Riad M.', { fr: 'Détartrage', ar: 'إزالة الجير', en: 'Cleaning' }],
        [{ fr: 'Le simulateur m’a donné le prix avant de venir. Aucune surprise le jour J.', ar: 'أعطاني المحاكي السعر قبل المجيء. لا مفاجآت.', en: 'The estimator gave me the price before I came. No surprises.' }, 'Samia K.', { fr: 'Implant', ar: 'زراعة', en: 'Implant' }]] },
      booking: { h: { fr: 'Prendre rendez-vous', ar: 'حجز موعد', en: 'Book an appointment' }, lead: { fr: 'Choisissez le soin et le créneau : le cabinet vous confirme par SMS.', ar: 'اختر العلاج والموعد، وتؤكد لك العيادة برسالة.', en: 'Choose a treatment and a slot: the practice confirms by text.' }, q1: { fr: 'Quel soin ?', ar: 'أي علاج؟', en: 'Which treatment?' } },
      access: { addr: { fr: '12 rue des Orangers, Blida', ar: '12 شارع البرتقال، البليدة', en: '12 rue des Orangers, Blida' }, park: { fr: 'Parking à 50 m · accès PMR', ar: 'موقف على بعد 50 م', en: 'Parking 50 m away · step-free access' } },
      admin: { reqTab: 'Rendez-vous', who: 'patient', serp: 'Dentiste à Blida — Cabinet Ibtissama | Rendez-vous en ligne', serpD: 'Soins, blanchiment, implants. Ouvert du samedi au jeudi. Estimez votre devis et prenez rendez-vous en ligne.' },
      seed: [['Mourad Kaci', '0661 40 22 18', 'consult', 1, '14:30', 'new'], ['Feriel Amrani', '0770 15 63 02', 'blanc', 2, '11:00', 'ok'], ['Rania Bouzid', '0550 98 31 77', 'detart', 0, '10:00', 'ok'], ['Yacine Lounis', '0662 77 10 45', 'implant', 3, '15:00', 'ok']]
    },

    // ===================== Fournisseur de matériel dentaire =====================
    materiel: {
      key: 'materiel', label: { fr: 'Fournisseur de matériel dentaire', ar: 'مورد معدات طب الأسنان', en: 'Dental equipment supplier' },
      brand: { fr: 'Kalimed', ar: 'كاليمد', en: 'Kalimed' }, sub: { fr: 'Équipement dentaire · Alger', ar: 'معدات الأسنان · الجزائر', en: 'Dental equipment · Algiers' }, icon: 'chair',
      theme: { dark: 1, p: '#c8a96a', pd: '#b2924f', pt: 'rgba(200,169,106,.12)', bg: '#0f0f11', bg2: '#141416', card: '#17171a', ink: '#f3efe7', mut: '#a39e95', bd: 'rgba(255,255,255,.09)', field: '#1d1d21', deep: '#09090a', on: '#17120a', eb: '#c8a96a', hl: '#d9bd84', urg: '#c8a96a', urgInk: '#17120a' },
      logo: { mark: 'chair', upper: 1 },
      video: { hd: V + '4488800/4488800-hd_1920_1080_25fps.mp4', sd: V + '4488800/4488800-sd_960_540_25fps.mp4', poster: 'https://images.pexels.com/videos/4488800/pexels-photo-4488800.jpeg?auto=compress&cs=tinysrgb&w=1600' },
      phone: '023 45 67 89', domain: 'kalimed.dz',
      hours: [['08:30', '17:30'], ['08:30', '17:30'], ['08:30', '17:30'], ['08:30', '17:30'], ['08:30', '12:30'], null, ['08:30', '17:30']],
      hero: {
        eb: { fr: 'Fauteuils & équipement dentaire', ar: 'كراسي ومعدات طب الأسنان', en: 'Dental chairs & equipment' },
        h1: { fr: 'Le fauteuil qui <em>fait la différence</em> dans votre cabinet.', ar: 'الكرسي الذي <em>يصنع الفرق</em> في عيادتك.', en: 'The chair that <em>makes the difference</em> in your practice.' },
        lead: { fr: 'Fauteuils, units et accessoires, livrés, installés et suivis par nos techniciens partout en Algérie.', ar: 'كراسي ووحدات وملحقات، تُسلَّم وتُركَّب ويتابعها تقنيونا في كل أنحاء الجزائر.', en: 'Chairs, delivery units and accessories, delivered, installed and serviced by our technicians across Algeria.' },
        book: { fr: 'Nous contacter', ar: 'اتصل بنا', en: 'Contact us' },
        cat: { fr: 'Voir tous nos fauteuils', ar: 'شاهد كل كراسينا', en: 'See all our chairs' },
        second: { fr: 'Configurer mon fauteuil', ar: 'صمّم كرسيك', en: 'Configure my chair' }
      },
      trust: [['600+', { fr: 'cabinets équipés', ar: 'عيادة مجهزة', en: 'practices equipped' }], ['48 h', { fr: 'intervention SAV', ar: 'تدخل خدمة ما بعد البيع', en: 'service call-out' }], ['5 ans', { fr: 'de garantie', ar: 'ضمان', en: 'warranty' }]],
      nav: { fr: ['Fauteuils', 'Configurateur', 'Rénovation', 'Avis', 'Contact'], ar: ['الكراسي', 'المصمّم', 'التجديد', 'الآراء', 'اتصل بنا'], en: ['Chairs', 'Configurator', 'Renovation', 'Reviews', 'Contact'] },
      contactOnly: 1, wa: '0555 98 76 54',
      urgent: {
        btn: { fr: 'SAV express', ar: 'خدمة سريعة', en: 'Express service' },
        title: { fr: 'Fauteuil en panne ? On intervient.', ar: 'كرسي معطل؟ نتدخل.', en: 'Chair out of order? We’re on it.' },
        text: { fr: 'Un technicien vous rappelle dans l’heure, intervention sous 48 h dans toute l’Algérie.', ar: 'يتصل بك تقني خلال ساعة، والتدخل خلال 48 ساعة في كل الجزائر.', en: 'A technician calls back within the hour, on site within 48 h anywhere in Algeria.' },
        tips: { fr: ['Envoyez une photo de la panne sur WhatsApp.', 'Notez le numéro de série (sous l’assise).', 'Coupez l’alimentation en cas de fuite.'], ar: ['أرسل صورة العطل عبر واتساب.', 'دوّن الرقم التسلسلي (تحت المقعد).', 'افصل الكهرباء في حالة تسرب.'], en: ['Send a photo of the fault on WhatsApp.', 'Note the serial number (under the seat).', 'Switch off the power if there is a leak.'] }
      },
      services: {
        eb: { fr: 'Nos fauteuils', ar: 'كراسينا', en: 'Our chairs' }, h: { fr: 'Trois fauteuils, pour chaque cabinet.', ar: 'ثلاثة كراسٍ لكل عيادة.', en: 'Three chairs, for every practice.' },
        lead: { fr: 'Prix affichés, installation et formation comprises.', ar: 'أسعار معلنة، التركيب والتكوين مشمولان.', en: 'Prices shown, installation and training included.' },
        items: [
          { id: 'k1', img: U('1704455306251-b4634215d98f'), min: 1450000, max: 1450000, dur: 0, model: 1, n: { fr: 'Fauteuil K1 Essentiel', ar: 'كرسي K1 الأساسي', en: 'K1 Essential chair' }, d: { fr: 'Fiable et simple, idéal pour démarrer.', ar: 'موثوق وبسيط، مثالي للبداية.', en: 'Reliable and simple, ideal to get started.' } },
          { id: 'k3', img: U('1643660526741-094639fbe53a'), min: 2100000, max: 2100000, dur: 0, model: 1, n: { fr: 'Fauteuil K3 Confort', ar: 'كرسي K3 الراحة', en: 'K3 Comfort chair' }, d: { fr: 'Sellerie mémoire de forme, mouvements silencieux.', ar: 'تنجيد مريح وحركة صامتة.', en: 'Memory-foam upholstery, silent motion.' } },
          { id: 'k5', img: U('1598256989800-fe5f95da9787'), min: 2950000, max: 2950000, dur: 0, model: 1, n: { fr: 'Fauteuil K5 Signature', ar: 'كرسي K5 المميز', en: 'K5 Signature chair' }, d: { fr: 'Le haut de gamme : programmable, éclairage intégré.', ar: 'الفئة العليا: قابل للبرمجة وإضاءة مدمجة.', en: 'Top of the range: programmable, built-in lighting.' } },
          { id: 'led', ic: 'sun', min: 220000, max: 220000, n: { fr: 'Scialytique LED', ar: 'مصباح LED', en: 'LED operating light' }, d: { fr: '', ar: '', en: '' } },
          { id: 'unit', img: U('1770321119305-f191c09c5801'), min: 380000, max: 380000, n: { fr: 'Unit 5 instruments', ar: 'وحدة 5 أدوات', en: '5-instrument unit' }, d: { fr: '', ar: '', en: '' } },
          { id: 'stool', ic: 'stool', min: 45000, max: 45000, n: { fr: 'Tabouret praticien', ar: 'كرسي الطبيب', en: 'Practitioner stool' }, d: { fr: '', ar: '', en: '' } },
          { id: 'install', ic: 'wrench', min: 0, max: 0, n: { fr: 'Installation & formation', ar: 'التركيب والتكوين', en: 'Installation & training' }, d: { fr: '', ar: '', en: '' } }
        ]
      },
      colors: [['blanc', '#e5e7eb', U('1704455306925-1401c3012117'), { fr: 'Blanc', ar: 'أبيض', en: 'White' }], ['bleu', '#2563eb', U('1643660526741-094639fbe53a'), { fr: 'Bleu', ar: 'أزرق', en: 'Blue' }], ['orange', '#ea580c', U('1598256989800-fe5f95da9787'), { fr: 'Orange', ar: 'برتقالي', en: 'Orange' }], ['menthe', '#14b8a6', U('1643660527098-559f89e45a92'), { fr: 'Menthe', ar: 'نعناعي', en: 'Mint' }], ['prune', '#7c3aed', U('1643660527190-4f401370f788'), { fr: 'Prune', ar: 'بنفسجي', en: 'Plum' }]],
      estim: { book: { fr: 'Recevoir ce devis sur WhatsApp', ar: 'استلم هذا التقدير عبر واتساب', en: 'Get this quote on WhatsApp' }, eb: { fr: 'Configurateur', ar: 'المصمّم', en: 'Configurator' }, h: { fr: 'Composez votre poste de travail.', ar: 'صمّم وحدة عملك.', en: 'Build your workstation.' }, lead: { fr: 'Choisissez le fauteuil, la couleur de sellerie et les équipements : le prix se calcule en direct, et vous recevez le devis sur WhatsApp.', ar: 'اختر الكرسي ولون التنجيد والمعدات: يُحسب السعر مباشرة، وتستلم التقدير عبر واتساب.', en: 'Choose the chair, upholstery colour and equipment: the price updates live and you get the quote on WhatsApp.' } },
      ba: { img: U('1629909613654-28e377c37b09'), beforeImg: U('1630226040750-d934f017f0e4'), before: 'contrast(1.06) saturate(1.06)', eb: { fr: 'Rénovation de cabinet', ar: 'تجديد العيادة', en: 'Practice renovation' }, h: { fr: 'Votre cabinet, transformé.', ar: 'عيادتك، بحلّة جديدة.', en: 'Your practice, transformed.' }, lead: { fr: 'Faites glisser : d’un cabinet d’hier à un poste de travail équipé par Kalimed.', ar: 'اسحب: من عيادة الأمس إلى وحدة عمل جهزتها كاليمد.', en: 'Drag: from yesterday’s practice to a workstation equipped by Kalimed.' } },
      gallery: { eb: { fr: 'Showroom', ar: 'صالة العرض', en: 'Showroom' }, h: { fr: '400 m² pour voir nos fauteuils de près.', ar: '400 م² لرؤية كراسينا عن قرب.', en: '400 m² to see our chairs up close.' }, items: [[U('1722586663860-a0a372da5c57'), { fr: 'K5 Signature', ar: 'K5 المميز', en: 'K5 Signature' }], [U('1704455306925-1401c3012117'), { fr: 'Espace démonstration', ar: 'فضاء العرض', en: 'Demo area' }], [U('1728342057953-94bfad8f0e7e'), { fr: 'Finitions', ar: 'التشطيبات', en: 'Finishes' }]] },
      reviews: { eb: { fr: 'Ils nous font confiance', ar: 'يثقون بنا', en: 'They trust us' }, h: { fr: 'Des cabinets équipés partout en Algérie.', ar: 'عيادات مجهزة في كل الجزائر.', en: 'Practices equipped across Algeria.' }, items: [
        [{ fr: 'Installation en une journée, formation de l’assistante incluse. Le cabinet a rouvert le lendemain.', ar: 'تركيب في يوم واحد مع تكوين المساعدة. أُعيد فتح العيادة في اليوم التالي.', en: 'Installed in a day, assistant training included. We reopened the next day.' }, 'Dr Benali', { fr: 'Oran', ar: 'وهران', en: 'Oran' }],
        [{ fr: 'Une panne un jeudi, technicien sur place le samedi. Je ne m’attendais pas à ça.', ar: 'عطل يوم الخميس، وتقني في العيادة يوم السبت. لم أتوقع ذلك.', en: 'Fault on a Thursday, technician on site on Saturday. Didn’t expect that.' }, 'Dr Saadi', { fr: 'Sétif', ar: 'سطيف', en: 'Sétif' }],
        [{ fr: 'Le configurateur m’a permis de comparer avant de me déplacer au showroom.', ar: 'سمح لي المصمّم بالمقارنة قبل زيارة صالة العرض.', en: 'The configurator let me compare before visiting the showroom.' }, 'Dr Hamidi', { fr: 'Constantine', ar: 'قسنطينة', en: 'Constantine' }]] },
      booking: { h: { fr: 'Essayer un fauteuil', ar: 'جرّب كرسيًا', en: 'Try a chair' }, lead: { fr: 'Au showroom, dans votre cabinet ou en visio : un conseiller vous confirme le rendez-vous par SMS.', ar: 'في صالة العرض أو في عيادتك أو عن بعد: يؤكد لك مستشار الموعد برسالة.', en: 'At our showroom, your practice or by video call: an advisor confirms by text.' }, q1: { fr: 'Quel équipement ?', ar: 'أي معدات؟', en: 'Which equipment?' } },
      access: { addr: { fr: 'Zone d’activité, Bab Ezzouar, Alger', ar: 'منطقة النشاطات، باب الزوار، الجزائر', en: 'Business park, Bab Ezzouar, Algiers' }, park: { fr: 'Showroom de 400 m² · parking clients', ar: 'صالة عرض 400 م² · موقف للزبائن', en: '400 m² showroom · customer parking' } },
      admin: { reqTab: 'Demandes d’essai', who: 'client', serp: 'Fauteuils dentaires en Algérie — Kalimed | Configurateur & essai en showroom', serpD: 'Fauteuils, units et accessoires dentaires. Livraison, installation et SAV 48 h partout en Algérie. Configurez votre poste en ligne.' },
      seed: [['Dr Mourad Kaci', '0661 40 22 18', 'k3', 1, '10:30', 'new'], ['Dr Feriel Amrani', '0770 15 63 02', 'k5', 2, '14:00', 'ok'], ['Dr Rania Bouzid', '0550 98 31 77', 'unit', 0, '09:30', 'ok'], ['Dr Yacine Lounis', '0662 77 10 45', 'k1', 3, '11:00', 'ok']]
    }
  };
})();
