"use strict";

/*
|--------------------------------------------------------------------------
| Seeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Hash = use("Hash");
const User = use("App/Models/User");
const UserType = use("App/Models/UserType");
const Departamento = use("App/Models/Departamento");
const Semestre = use("App/Models/Semestre");
const Disciplina = use("App/Models/Disciplina");
const DisciplinaOfertada = use("App/Models/DisciplinaOfertada");
const Turma = use("App/Models/Turma");
const TurmaTutor = use("App/Models/TurmaTutor")
const ProblemaUnidade = use("App/Models/ProblemaUnidade")
const Problema = use("App/Models/Problema")

class Seeder {
  async run() {
    // Criação dos tipos de usuário
    const user_type1 = { type: "administrador" };
    const user_type2 = { type: "tutor" };
    const user_type3 = { type: "coordenador" };
    const user_type4 = { type: "aluno" };

    await UserType.create(user_type1);
    await UserType.create(user_type2);
    await UserType.create(user_type3);
    await UserType.create(user_type4);

    // Criação dos usuários
    const user1 = {
      username: "adm@adm",
      password: "adm12345",
      email: "ambientewebpbl@gmail.com",
      enrollment: "00000000",
      user_type: 1,
      first_name: "Administrador",
      surname: "PBL"
    };

    const user2 = {
        username: "roberto@tutor",
        password: "roberto12345",
        email: "romaiajr5@gmail.com",
        enrollment: "18111240",
        user_type: 2,
        first_name: "Roberto",
        surname: "Maia"
      };

    const user3 = {
        username: "claudia@tutor",
        password: "claudia12345",
        email: "claudia@gmail.com",
        enrollment: "00000001",
        user_type: 2,
        first_name: "Claudia",
        surname: "Pinto"
      };

    await User.create(user1);
    await User.create(user2);
    await User.create(user3);

    // Criação dos departamentos
    const departamento1 ={
        name: "Departamento de ciências exatas",
        abbreviation: "DEXA"
    }

    const departamento2 ={
        name: "Departamento de tecnologia",
        abbreviation: "DTEC"
    }

    await Departamento.create(departamento1);
    await Departamento.create(departamento2);

    // Criação dos semestres
    const semestre1 = {
        code: "2019.1",
        start_date: "2019-03-01",
        end_date: "2019-08-30",
    }

    const semestre2 = {
      code: "2019.2",
      start_date: "2019-09-30",
      end_date: "2019-12-23",
    }

    const semestre3 = {
      code: "2022.1",
      start_date: "2022-03-07",
      end_date: "2022-08-30",
    }   
    
    await Semestre.create(semestre1);
    await Semestre.create(semestre2);
    await Semestre.create(semestre3);

    // Criação das disciplinas
    const disciplina1 = {
      code: 'EXA857',
      name: 'ENGENHARIA DE SOFTWARE',
      workload: 60,
      departamento_id: 1,
      folder_id: '1wbP5vSIIJytjAXe1q7eoBdE8ehuwwJk_'
    }
    const disciplina2 = {
      code: 'TEC498',
      name: 'PROJETO DE CIRCUITOS DIGITAIS',
      workload: 60,
      departamento_id: 2,
      folder_id: '137aCkjzHScJ-YowfJ712VmSNtpZF1k52'
    }
    const disciplina3 = {
      code: 'EXA863',
      name: 'PROGRAMAÇÃO I',
      workload: 60,
      departamento_id: 1,
      folder_id: '1DvDsZOjI2SSAWXBbYtnfeHV_D20hI8HV'
    }
    const disciplina4 = {
      code: 'TEC499',
      name: 'SISTEMAS DIGITAIS',
      workload: 60,
      departamento_id: 2,
      folder_id: '1blWhGZmQZ_8rcgJRCjAtaQowFjcp9ZBE'
    }

    await Disciplina.create(disciplina1)
    await Disciplina.create(disciplina2)
    await Disciplina.create(disciplina3)
    await Disciplina.create(disciplina4)

    // Criação das disciplinas ofertadas
    const disciplina_ofertada1 = {
      disciplina_id: 1,
      semestre_id: 3,
      number_of_classes: 2,
      folder_id: "1vE87-OrQFjkfsgL9pQIkdilwuoxPhvRS"
    }
    const disciplina_ofertada2 = {
      disciplina_id: 3,
      semestre_id: 1,
      number_of_classes: 2,
      folder_id: "1zv4SWn_hOssDVSju0I3_0ILJWvzobb08"
    }

    await DisciplinaOfertada.create(disciplina_ofertada1)
    await DisciplinaOfertada.create(disciplina_ofertada2)

    //Criação das turmas
    const turma1 = {
      code: 'P01',
      disciplina_id: 1,
      class_days: "seg,qua",
      class_time: "15:30 - 17:30",
      folder_id: '1juKo5NyiGe5UXA_YGOkXM8VLKI3t5nY1'
    }
    const turma2 = {
      code: 'P02',
      disciplina_id: 1,
      class_days: "seg,qua",
      class_time: "15:30 - 17:30",
      folder_id: '1byDj6__oO2JPMhuDlrIFd1xK6JcsG-_R'
    }
    const turma3 = {
      code: 'P01',
      disciplina_id: 2,
      class_days: "ter,qui",
      class_time: "13:30 - 15:30",
      folder_id: '1xhLV-AhmF5-azpQJ0oPrhLEiZy6LXk07'
    }
    const turma4 = {
      code: 'P02',
      disciplina_id: 2,
      class_days: "ter,qui",
      class_time: "13:30 - 15:30",
      folder_id: '1hKlInwDxMlfH3Y8HHpYfh06okx41mwX_'
    }

    await Turma.create(turma1)
    await Turma.create(turma2)
    await Turma.create(turma3)
    await Turma.create(turma4)

    //Criação da relação turma tutor
    const turma_tutor1 = {
      user_id: 2,
      turma_id: 1
    }
    const turma_tutor2 = {
      user_id: 3,
      turma_id: 2
    }
    const turma_tutor3 = {
      user_id: 2,
      turma_id: 3
    }
    const turma_tutor4 = {
      user_id:3,
      turma_id: 4
    }

    await TurmaTutor.create(turma_tutor1)
    await TurmaTutor.create(turma_tutor2)
    await TurmaTutor.create(turma_tutor3)
    await TurmaTutor.create(turma_tutor4)

    const problema_1 = {
      title:'Urna Eletrônica',
      description: 'Criar uma urna para as eleições',
      active:1
    }

    await Problema.create(problema_1)

    const problema_unidade1 ={
      disciplina_ofertada_id: 2,
      problema_id: 1,
      data_entrega: '2021-10-05'
    }

    await ProblemaUnidade.create(problema_unidade1)
  }
}

module.exports = Seeder;
