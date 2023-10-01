const { RunInstancesCommand, EC2Client } = require('@aws-sdk/client-ec2');
// const ssh = require()

const ec2Client = new EC2Client();

async function sshconnection() {

}

exports.post_instance = async (req, res, next) => {
    try {
        const package = req.body;
        console.log(package);



        const instance_params = {
            KeyName: keyPairName,
            SecurityGroupIds: [securityGroupId],
            ImageId: imageId,
            InstanceType: instanceType,
            MinCount: 1,
            MaxCount: 1,
        }

        const command = new RunInstancesCommand(instance_params);
        const { Instances } = await ec2Client.send(command);
        await waitUntilInstanceStatusOk(
            { client: ec2Client },
            { InstanceIds: [Instances[0].InstanceId] }
        );
        console.log(Instances[0].InstanceId);

        return res.status(201).json({
            message: "Instance created successfully"
        })
    }
    catch (err) {
        console.log(err);
    }

}