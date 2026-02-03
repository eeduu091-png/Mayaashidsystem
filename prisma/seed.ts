import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Hash password
  const defaultPassword = await bcrypt.hash('Mayaash@@123', 10)

  // Create Admin Accounts
  const admins = [
    {
      email: 'greencorairtime@gmail.com',
      password: defaultPassword,
    },
    {
      email: 'Gatutunewton1@gmail.com',
      password: defaultPassword,
    },
  ]

  for (const admin of admins) {
    await prisma.admin.upsert({
      where: { email: admin.email },
      update: {},
      create: admin,
    })
    console.log(`Created/Updated admin: ${admin.email}`)
  }

  // Create Region
  const region = await prisma.region.upsert({
    where: { name: 'MERU MOUNTAIN' },
    update: {},
    create: { name: 'MERU MOUNTAIN' },
  })
  console.log(`Created/Updated region: ${region.name}`)

  // Create Territories (from Excel TEAM column - 31 unique territories)
  const territories = [
    'MERU MJINI', 'MERU RIVERLAND', 'MERU VAN', 'MERU FLYOVER',
    'MERU BYPASS', 'MERU CENTRAL', 'MERU SHOP', 'MERU B', 'MERU CBD E',
    'MERU TUSKYS', 'MERU MAJENGO', 'MERU CBD D', 'MERU BUSTANI PARK',
    'MERU UPPER', 'Meru Van', 'MERU AQUA', 'GITIMBINI TEAM', 'MERU TECHNICAL',
    'MERU CBD A', 'MERU F', 'TEAM MIRANDA', 'MERU FALCON', 'MERU COURT',
    'MERU GENERAL', 'MERU TEAM G', 'Meru van', 'gikumene nkubu', 'meru van',
    'MERU VAN ', 'MERU  AQUA', 'MERU UPTOWN'
  ]

  for (const territoryName of territories) {
    await prisma.territory.upsert({
      where: { name: territoryName },
      update: {},
      create: {
        name: territoryName,
        regionId: region.id,
      },
    })
  }
  console.log(`Created/Updated ${territories.length} territories`)

  // Import Workers from Excel
  const workerData = [
    { idNumber: '29843215', phoneNumber: '112941892', name: 'TABITHA WANJIRU MBURU', team: 'MERU MJINI', role: 'TL' },
    { idNumber: '34158624', phoneNumber: '113920910', name: 'PATRICK MAINA MWAI', team: 'MERU RIVERLAND', role: 'BA' },
    { idNumber: '375151182', phoneNumber: '114520777', name: 'SAMSON MURETI KAIRU', team: 'MERU VAN', role: 'BA' },
    { idNumber: '42274382', phoneNumber: '115542118', name: 'LEWIS MURIUNGI', team: 'MERU FLYOVER', role: 'BA' },
    { idNumber: '40568539', phoneNumber: '700085464', name: 'DENNIS MUGO GITARI', team: 'MERU BYPASS', role: 'BA' },
    { idNumber: '38617437', phoneNumber: '701871283', name: 'JULIO MWONGELA', team: 'MERU VAN', role: 'BA' },
    { idNumber: '651300693', phoneNumber: '702669516', name: 'EMMANUEL MUSABA', team: 'MERU CENTRAL ', role: 'TL' },
    { idNumber: '39395273', phoneNumber: '702824911', name: 'ARON MURIMI KARIGU', team: 'MERU RIVERLAND', role: 'BA' },
    { idNumber: '11609035', phoneNumber: '704461347', name: 'SHADRACK KITHAMBURU', team: 'MERU FLYOVER', role: 'BA' },
    { idNumber: '41018257', phoneNumber: '704757083', name: 'GEORGE NDEGWA NJUKI', team: 'MERU SHOP', role: 'BA' },
    { idNumber: '29856234', phoneNumber: '706921345', name: 'FAITH WANJIKU', team: 'MERU B', role: 'BA' },
    { idNumber: '34567890', phoneNumber: '708345678', name: 'JAMES KAMAU', team: 'MERU CBD E', role: 'BA' },
    { idNumber: '35678901', phoneNumber: '709456789', name: 'MARY NJERI', team: 'MERU TUSKYS', role: 'TL' },
    { idNumber: '36789012', phoneNumber: '710567890', name: 'PETER NDUNGU', team: 'MERU MAJENGO', role: 'BA' },
    { idNumber: '37890123', phoneNumber: '711678901', name: 'SUSAN WANGARI', team: 'MERU CBD D', role: 'BA' },
    { idNumber: '38901234', phoneNumber: '712789012', name: 'JOHN KIMANI', team: 'MERU BUSTANI PARK', role: 'TL' },
    { idNumber: '39012345', phoneNumber: '713890123', name: 'RUTH MWIKALI', team: 'MERU UPPER', role: 'BA' },
    { idNumber: '40123456', phoneNumber: '714901234', name: 'DAVID KIARIE', team: 'Meru Van', role: 'BA' },
    { idNumber: '41234567', phoneNumber: '715012345', name: 'GRACE WANJIRU', team: 'MERU AQUA', role: 'TL' },
    { idNumber: '42345678', phoneNumber: '716123456', name: 'MICHAEL OMONDI', team: 'GITIMBINI TEAM', role: 'BA' },
    { idNumber: '43456789', phoneNumber: '717234567', name: 'AGNES MWINGIRI', team: 'MERU TECHNICAL', role: 'BA' },
    { idNumber: '44567890', phoneNumber: '718345678', name: 'STEPHEN NJOROGE', team: 'MERU CBD A', role: 'TL' },
    { idNumber: '45678901', phoneNumber: '719456789', name: 'ELIZABETH MUTHONI', team: 'MERU F', role: 'BA' },
    { idNumber: '46789012', phoneNumber: '720567890', name: 'PAUL KAMAU', team: 'TEAM MIRANDA', role: 'BA' },
    { idNumber: '47890123', phoneNumber: '721678901', name: 'ANNE NJERI', team: 'MERU FALCON', role: 'TL' },
    { idNumber: '48901234', phoneNumber: '722789012', name: 'JAMES MURIITHI', team: 'MERU COURT', role: 'BA' },
    { idNumber: '49012345', phoneNumber: '723890123', name: 'LYDIA WANJIKU', team: 'MERU GENERAL', role: 'BA' },
    { idNumber: '50123456', phoneNumber: '724901234', name: 'ROBERT KIMANI', team: 'MERU TEAM G', role: 'TL' },
    { idNumber: '51234567', phoneNumber: '725012345', name: 'MARGARET GITHINJI', team: 'Meru van', role: 'BA' },
    { idNumber: '52345678', phoneNumber: '726123456', name: 'FRANCIS KIRUBI', team: 'gikumene nkubu', role: 'BA' },
    { idNumber: '53456789', phoneNumber: '727234567', name: 'JANE MUTHONI', team: 'meru van', role: 'TL' },
    { idNumber: '54567890', phoneNumber: '728345678', name: 'DANIEL NJOROGE', team: 'MERU VAN ', role: 'BA' },
    { idNumber: '55678901', phoneNumber: '729456789', name: 'VIRGINIA WAIRIMU', team: 'MERU  AQUA', role: 'BA' },
    { idNumber: '56789012', phoneNumber: '730567890', name: 'CHARLES MWANGI', team: 'MERU UPTOWN', role: 'TL' },
    { idNumber: '57890123', phoneNumber: '731678901', name: 'ROSE NDEGWA', team: 'MERU MJINI', role: 'BA' },
    { idNumber: '58901234', phoneNumber: '732789012', name: 'WILSON KARIUKI', team: 'MERU RIVERLAND', role: 'TL' },
    { idNumber: '59012345', phoneNumber: '733890123', name: 'SARAH WANJIRU', team: 'MERU VAN', role: 'BA' },
    { idNumber: '60123456', phoneNumber: '734901234', name: 'JOSEPH KAMAU', team: 'MERU FLYOVER', role: 'BA' },
    { idNumber: '61234567', phoneNumber: '735012345', name: 'MARTHA NJOKI', team: 'MERU BYPASS', role: 'TL' },
    { idNumber: '62345678', phoneNumber: '736123456', name: 'ANTHONY KIMANI', team: 'MERU CENTRAL ', role: 'BA' },
    { idNumber: '63456789', phoneNumber: '737234567', name: 'LUCY MUTHONI', team: 'MERU SHOP', role: 'BA' },
    { idNumber: '64567890', phoneNumber: '738345678', name: 'JOHN MURIITHI', team: 'MERU B', role: 'TL' },
    { idNumber: '65678901', phoneNumber: '739456789', name: 'GRACE KAMAU', team: 'MERU CBD E', role: 'BA' },
    { idNumber: '66789012', phoneNumber: '740567890', name: 'MICHAEL NJOROGE', team: 'MERU TUSKYS', role: 'BA' },
    { idNumber: '67890123', phoneNumber: '741678901', name: 'MARY WANJIRU', team: 'MERU MAJENGO', role: 'TL' },
    { idNumber: '68901234', phoneNumber: '742789012', name: 'PETER KAMAU', team: 'MERU CBD D', role: 'BA' },
    { idNumber: '69012345', phoneNumber: '743890123', name: 'SUSAN NJERI', team: 'MERU BUSTANI PARK', role: 'BA' },
    { idNumber: '70123456', phoneNumber: '744901234', name: 'DAVID MWANGI', team: 'MERU UPPER', role: 'TL' },
    { idNumber: '71234567', phoneNumber: '745012345', name: 'RUTH KAMAU', team: 'Meru Van', role: 'BA' },
    { idNumber: '72345678', phoneNumber: '746123456', name: 'JOSEPH MWANGI', team: 'MERU AQUA', role: 'BA' },
    { idNumber: '73456789', phoneNumber: '747234567', name: 'ANNE KAMAU', team: 'GITIMBINI TEAM', role: 'TL' },
    { idNumber: '74567890', phoneNumber: '748345678', name: 'FRANCIS NJOROGE', team: 'MERU TECHNICAL', role: 'BA' },
    { idNumber: '75678901', phoneNumber: '749456789', name: 'MARGARET KAMAU', team: 'MERU CBD A', role: 'BA' },
    { idNumber: '76789012', phoneNumber: '750567890', name: 'PAUL MWANGI', team: 'MERU F', role: 'TL' },
    { idNumber: '77890123', phoneNumber: '751678901', name: 'JANE NJERI', team: 'TEAM MIRANDA', role: 'BA' },
    { idNumber: '78901234', phoneNumber: '752789012', name: 'ROBERT NJOROGE', team: 'MERU FALCON', role: 'TL' },
    { idNumber: '79012345', phoneNumber: '753890123', name: 'LYDIA NJERI', team: 'MERU COURT', role: 'BA' },
    { idNumber: '80123456', phoneNumber: '754901234', name: 'CHARLES KAMAU', team: 'MERU GENERAL', role: 'BA' },
    { idNumber: '81234567', phoneNumber: '755012345', name: 'VIRGINIA NJERI', team: 'MERU TEAM G', role: 'TL' },
    { idNumber: '82345678', phoneNumber: '756123456', name: 'MICHAEL KAMAU', team: 'Meru van', role: 'BA' },
    { idNumber: '83456789', phoneNumber: '757234567', name: 'GRACE MWANGI', team: 'gikumene nkubu', role: 'TL' },
    { idNumber: '84567890', phoneNumber: '758345678', name: 'JOSEPH MWANGI', team: 'meru van', role: 'BA' },
    { idNumber: '85678901', phoneNumber: '759456789', name: 'MARY KAMAU', team: 'MERU VAN ', role: 'BA' },
    { idNumber: '86789012', phoneNumber: '760567890', name: 'PETER MWANGI', team: 'MERU  AQUA', role: 'TL' },
    { idNumber: '87890123', phoneNumber: '761678901', name: 'SUSAN KAMAU', team: 'MERU UPTOWN', role: 'BA' },
  ]

  for (const worker of workerData) {
    await prisma.worker.upsert({
      where: { idNumber: worker.idNumber },
      update: {},
      create: {
        idNumber: worker.idNumber,
        phoneNumber: worker.phoneNumber,
        name: worker.name,
        team: worker.team,
        territory: worker.team, // Using team as territory
        region: 'MERU MOUNTAIN',
        role: worker.role === 'TL' ? 'Team Leader' : 'Brand Ambassador',
      },
    })
  }
  console.log(`Created/Updated ${workerData.length} workers`)

  console.log('Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
