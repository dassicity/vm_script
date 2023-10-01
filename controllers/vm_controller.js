const { RunInstancesCommand, EC2Client, waitUntilInstanceStatusOk, DescribeInstancesCommand } = require('@aws-sdk/client-ec2');
const { NodeSSH } = require('node-ssh')
const fs = require('fs');

const User = require('../models/users');
const Machines = require('../models/machines');

const ec2Client = new EC2Client({ region: "ap-south-1" });


exports.post_instance = async (req, res, next) => {
    try {
        const packages = req.body;

        const machine = new Machines({
            user_id: req.user._id,
            instance_id: null
        });

        machine.save()
            .then(machine => {
                console.log("Machine", machine);
            })
            .catch(err => {
                console.log(err);
            });

        User.findById(req.user._id)
            .then(user => {
                user.numOfVMId++;
                user.vmIDs.push(machine._id);

                return user.save();
            })
            .then(user => {
                console.log("User", user);
            })
            .catch(err => {
                console.log(err);
            })

        // console.log("Req.user", req.user);

        create_instance(machine._id, packages);

        return res.status(201).json({
            message: "Wait for confirmation",
            machine_id: machine._id,
        })
    }
    catch (err) {
        console.log(err);
    }

}

exports.get_status = async (req, res, next) => {
    try {
        const vm_id = req.query.vm_id;

        Machines.findById(vm_id)
            .then(machine => {
                if (!machine.instance_id) {
                    return res.json({
                        message: "Please wait more. Instance ID not created"
                    })
                }

                return res.json({
                    message: "Instance Id has been created",
                    instance_id: machine.instance_id
                })
            })
    }
    catch (err) {
        console.log(err);
    }
}



async function create_instance(machine_id, packages) {
    const instance_params = {
        KeyName: "dassic",
        SecurityGroupIds: ["sg-07a700893d1e1c129"],
        ImageId: "ami-0f5ee92e2d63afc18",
        InstanceType: "t2.micro",
        MinCount: 1,
        MaxCount: 1,
    }

    try {
        const command = new RunInstancesCommand(instance_params);
        const { Instances } = await ec2Client.send(command);
        await waitUntilInstanceStatusOk(
            { client: ec2Client },
            { InstanceIds: [Instances[0].InstanceId] }
        );
        console.log(Instances[0].InstanceId);
        const InstanceId = Instances[0].InstanceId;

        const describeInstancesCommand = new DescribeInstancesCommand({ InstanceIds: [InstanceId] });
        const describeInstancesResponse = await ec2Client.send(describeInstancesCommand);
        const publicIp = describeInstancesResponse.Reservations[0].Instances[0].PublicIpAddress;
        console.log('Public IP address:', publicIp);

        const privateKeyPath = '/home/soumyanil/dassic.pem';

        const ssh = new NodeSSH();
        await ssh.connect({
            host: publicIp,
            username: 'ubuntu',
            privateKey: fs.readFileSync(privateKeyPath, 'utf8'),
        });

        const commands = [
            'sudo apt update -y',
            `sudo apt install -y ${packages.package1}`,
            `sudo apt install -y ${packages.package2}`,
            `sudo apt install -y ${packages.package3}`,
            `sudo apt install -y ${packages.package4}`
        ];

        for (const command of commands) {
            const result = await ssh.execCommand(command);
            console.log(`SSH command ${command} exited with code ${result.code}`);
            console.log(`SSH command stdout:\n${result.stdout}`);
            console.error(`SSH command stderr:\n${result.stderr}`);
        }

        ssh.dispose();

        Machines.findById(machine_id)
            .then(machine => {
                machine.instance_id = InstanceId;
                return machine.save();
            })
            .then(machine => {
                console.log(machine);
            })
            .catch(err => {
                console.log(err);
            })

    }
    catch (err) {
        console.log(err);
    }
}